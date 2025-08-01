import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { 
  UpdateWhatsappConfigDto, 
  TestWhatsappDto,
  TwilioWebhookPayload
} from './dto/whatsapp-config.dto';
import { 
  WhatsappWebhookPayload, 
  WhatsappMessage,
  WhatsappOutgoingMessage,
  WhatsappApiResponse,
  UnifiedMessage
} from './interfaces/whatsapp-webhook.interface';
import * as crypto from 'crypto';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private aiService: AiService,
  ) {}

  // Get or create WhatsApp configuration for tenant
  async getWhatsappConfig(tenantId: string) {
    try {
      const botConfig = await this.aiService.getBotConfig(tenantId);
      
      return {
        id: botConfig.id,
        tenantId: botConfig.tenantId,
        // Meta configuration
        whatsappPhoneNumberId: botConfig.whatsappPhoneNumberId,
        whatsappProvider: botConfig.whatsappProvider,
        isWhatsappEnabled: botConfig.isWhatsappEnabled,
        hasAccessToken: !!botConfig.whatsappAccessToken,
        hasWebhookToken: !!botConfig.whatsappWebhookToken,
        // Twilio configuration
        twilioPhoneNumber: botConfig.twilioPhoneNumber,
        hasTwilioCredentials: !!(botConfig.twilioAccountSid && botConfig.twilioAuthToken),
      };
    } catch (error) {
      this.logger.error('Error getting WhatsApp config', error);
      throw new BadRequestException('Error al obtener configuración de WhatsApp');
    }
  }

  // Update WhatsApp configuration
  async updateWhatsappConfig(tenantId: string, updateDto: UpdateWhatsappConfigDto) {
    try {
      // Get current bot config
      const currentConfig = await this.aiService.getBotConfig(tenantId);
      
      // Update with new WhatsApp settings
      const updatedConfig = await this.prisma.botConfig.update({
        where: { tenantId },
        data: {
          // Meta fields
          whatsappPhoneNumberId: updateDto.whatsappPhoneNumberId,
          whatsappAccessToken: updateDto.whatsappAccessToken,
          whatsappWebhookToken: updateDto.whatsappWebhookToken,
          whatsappProvider: updateDto.whatsappProvider || 'cloud_api',
          isWhatsappEnabled: updateDto.isWhatsappEnabled,
          // Twilio fields
          twilioAccountSid: updateDto.twilioAccountSid,
          twilioAuthToken: updateDto.twilioAuthToken,
          twilioPhoneNumber: updateDto.twilioPhoneNumber,
        },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      // Return config without sensitive data
      return {
        ...updatedConfig,
        whatsappAccessToken: undefined,
        twilioAuthToken: undefined,
        hasAccessToken: !!updatedConfig.whatsappAccessToken,
        hasWebhookToken: !!updatedConfig.whatsappWebhookToken,
        hasTwilioCredentials: !!(updatedConfig.twilioAccountSid && updatedConfig.twilioAuthToken),
      };
    } catch (error) {
      this.logger.error('Error updating WhatsApp config', error);
      throw new BadRequestException('Error al actualizar configuración de WhatsApp');
    }
  }

  // Test WhatsApp configuration
  async testWhatsappConfig(tenantId: string, testDto: TestWhatsappDto) {
    try {
      const config = await this.prisma.botConfig.findUnique({
        where: { tenantId },
      });

      if (!config?.isWhatsappEnabled) {
        throw new BadRequestException('WhatsApp no está habilitado');
      }

      // Validar configuración según el proveedor
      if (config.whatsappProvider === 'twilio') {
        if (!config.twilioAccountSid || !config.twilioAuthToken) {
          throw new BadRequestException('Credenciales de Twilio no configuradas');
        }
      } else if (config.whatsappProvider === 'cloud_api') {
        if (!config.whatsappAccessToken || !config.whatsappPhoneNumberId) {
          throw new BadRequestException('Meta WhatsApp no está configurado correctamente');
        }
      }

      // Use test phone number or a default one
      const testPhone = testDto.testPhoneNumber || '+5215551234567'; // Default test number
      
      const result = await this.sendMessage(tenantId, testPhone, testDto.testMessage);
      
      return {
        success: true,
        message: 'Mensaje de prueba enviado correctamente',
        messageId: result.messageId,
        testPhone,
        testMessage: testDto.testMessage,
        provider: config.whatsappProvider,
      };
    } catch (error) {
      this.logger.error('Error testing WhatsApp config', error);
      throw new BadRequestException('Error en la prueba de WhatsApp: ' + error.message);
    }
  }

  // Verify webhook token (Meta)
  async verifyWebhookToken(token: string): Promise<boolean> {
    try {
      // Check if any tenant has this webhook token
      const config = await this.prisma.botConfig.findFirst({
        where: {
          whatsappWebhookToken: token,
          whatsappProvider: 'cloud_api',
          isWhatsappEnabled: true,
        },
      });
      
      return !!config;
    } catch (error) {
      this.logger.error('Error verifying webhook token', error);
      return false;
    }
  }

  // Verify webhook signature (Meta security)
  async verifyWebhookSignature(payload: any, signature: string): Promise<boolean> {
    try {
      if (!signature) return true; // Skip verification if no signature provided (for testing)
      
      const appSecret = this.configService.get('WHATSAPP_APP_SECRET');
      if (!appSecret) return true; // Skip if no app secret configured
      
      const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      return signature === `sha256=${expectedSignature}`;
    } catch (error) {
      this.logger.error('Error verifying webhook signature', error);
      return false;
    }
  }

  // Process incoming webhook from Meta
  async processMetaWebhook(payload: WhatsappWebhookPayload) {
    try {
      for (const entry of payload.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            await this.processMetaMessages(change.value);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error processing Meta webhook', error);
      throw error;
    }
  }

  // Process incoming webhook from Twilio
  async processTwilioWebhook(payload: TwilioWebhookPayload) {
    try {
      const from = payload.From?.replace('whatsapp:', ''); // Client phone number
      const to = payload.To?.replace('whatsapp:', '');     // Twilio number
      const message = payload.Body;                        // Message content
      
      if (!from || !message) {
        this.logger.warn('Invalid Twilio webhook payload', payload);
        return;
      }

      this.logger.log(`Processing Twilio message from ${from}: ${message}`);

      // Find tenant by Twilio configuration
      const config = await this.findTenantByTwilioNumber(to);
      if (!config) {
        this.logger.warn(`No tenant found for Twilio number: ${to}`);
        return;
      }

      // Convert to unified message format
      const unifiedMessage: UnifiedMessage = {
        from,
        id: payload.MessageSid,
        timestamp: new Date().toISOString(),
        type: 'text',
        text: { body: message },
        provider: 'twilio'
      };

      // Process using unified handler
      await this.processUnifiedMessage(config.tenantId, unifiedMessage);

    } catch (error) {
      this.logger.error('Error processing Twilio webhook', error);
    }
  }

  // Process Meta messages
  private async processMetaMessages(value: any) {
    try {
      const phoneNumberId = value.metadata?.phone_number_id;
      if (!phoneNumberId) return;

      // Find tenant by phone number ID
      const config = await this.prisma.botConfig.findFirst({
        where: {
          whatsappPhoneNumberId: phoneNumberId,
          whatsappProvider: 'cloud_api',
          isWhatsappEnabled: true,
        },
        include: { tenant: true },
      });

      if (!config) {
        this.logger.warn(`No tenant found for phone number ID: ${phoneNumberId}`);
        return;
      }

      // Process each message
      for (const message of value.messages || []) {
        // Convert to unified message format
        const unifiedMessage: UnifiedMessage = {
          from: message.from,
          id: message.id,
          timestamp: message.timestamp,
          type: message.type,
          text: message.text,
          provider: 'meta'
        };

        await this.processUnifiedMessage(config.tenantId, unifiedMessage);
      }
    } catch (error) {
      this.logger.error('Error processing Meta messages', error);
    }
  }

  // Process unified message (works for both Meta and Twilio)
  private async processUnifiedMessage(tenantId: string, message: UnifiedMessage) {
    try {
      if (message.type !== 'text') {
        this.logger.log(`Unsupported message type: ${message.type}`);
        return;
      }

      const userMessage = message.text?.body;
      const userPhone = message.from;

      if (!userMessage || !userPhone) return;

      this.logger.log(`Processing message from ${userPhone}: ${userMessage} (via ${message.provider})`);

      // Use AI service to generate response
      const aiResponse = await this.aiService.sendMessage(tenantId, {
        message: userMessage,
        conversationId: userPhone, // Use phone as conversation ID
        clientPhone: userPhone,
      });

      // Send AI response back to user
      await this.sendMessage(tenantId, userPhone, aiResponse.response);

    } catch (error) {
      this.logger.error('Error processing unified message', error);
      // Send error message to user
      try {
        await this.sendMessage(
          tenantId, 
          message.from, 
          'Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.'
        );
      } catch (sendError) {
        this.logger.error('Error sending error message', sendError);
      }
    }
  }

  // Find tenant by Twilio configuration (for sandbox, all messages come from same number)
  private async findTenantByTwilioNumber(twilioNumber: string) {
    // For Twilio Sandbox, all messages come from +14155238886
    // So we search for ANY tenant with Twilio enabled and valid credentials
    return await this.prisma.botConfig.findFirst({
      where: {
        whatsappProvider: 'twilio',
        isWhatsappEnabled: true,
        twilioAccountSid: { not: null },
        twilioAuthToken: { not: null },
      },
      include: { tenant: true },
    });
  }

  // Send message via WhatsApp API (supports both Meta and Twilio)
  async sendMessage(tenantId: string, to: string, text: string): Promise<{ success: boolean; messageId?: string }> {
    try {
      const config = await this.prisma.botConfig.findUnique({
        where: { tenantId },
      });

      if (!config?.isWhatsappEnabled) {
        throw new Error('WhatsApp no configurado');
      }

      // Route to appropriate provider
      if (config.whatsappProvider === 'twilio') {
        return await this.sendMessageViaTwilio(config, to, text);
      } else {
        return await this.sendMessageViaMeta(config, to, text);
      }
    } catch (error) {
      this.logger.error('Error sending WhatsApp message', error);
      throw new InternalServerErrorException('Error enviando mensaje de WhatsApp');
    }
  }

  // Meta Business Cloud API
  private async sendMessageViaMeta(config: any, to: string, text: string) {
    if (!config?.whatsappAccessToken || !config?.whatsappPhoneNumberId) {
      throw new Error('Meta WhatsApp no configurado');
    }

    const messagePayload: WhatsappOutgoingMessage = {
      messaging_product: 'whatsapp',
      to: to.replace(/\D/g, ''), // Remove non-digits
      type: 'text',
      text: {
        body: text,
        preview_url: true,
      },
    };

    const response = await fetch(
      `${this.WHATSAPP_API_URL}/${config.whatsappPhoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.whatsappAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      this.logger.error('Meta WhatsApp API error', { status: response.status, error: errorData });
      throw new Error(`Meta WhatsApp API error: ${response.status}`);
    }

    const result: WhatsappApiResponse = await response.json();
    const messageId = result.messages?.[0]?.id;

    this.logger.log(`Message sent via Meta`, { messageId, to });

    return {
      success: true,
      messageId,
    };
  }

  // Twilio WhatsApp API
  private async sendMessageViaTwilio(config: any, to: string, text: string) {
    if (!config?.twilioAccountSid || !config?.twilioAuthToken) {
      throw new Error('Twilio WhatsApp no configurado');
    }

    const twilio = require('twilio');
    const client = twilio(config.twilioAccountSid, config.twilioAuthToken);

    try {
      const message = await client.messages.create({
        body: text,
        from: 'whatsapp:+14155238886', // Always use Twilio Sandbox number
        to: `whatsapp:${to}`,
      });

      this.logger.log(`Message sent via Twilio`, { 
        messageId: message.sid, 
        to, 
        from: 'whatsapp:+14155238886' 
      });

      return {
        success: true,
        messageId: message.sid,
      };
    } catch (error) {
      this.logger.error('Twilio API error', error);
      throw new Error(`Twilio API error: ${error.message}`);
    }
  }

  // Get WhatsApp conversations for tenant
  async getWhatsappConversations(tenantId: string, limit: number = 50) {
    try {
      // Use existing chat history functionality
      return await this.aiService.getConversations(tenantId, limit);
    } catch (error) {
      this.logger.error('Error getting WhatsApp conversations', error);
      throw new BadRequestException('Error al obtener conversaciones de WhatsApp');
    }
  }
}