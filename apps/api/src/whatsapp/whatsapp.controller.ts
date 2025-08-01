import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Query, 
  Headers,
  HttpCode,
  BadRequestException,
  Logger,
  Put,
  Param
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '../auth/decorators/user.decorator';
import { 
  WhatsappConfigDto, 
  UpdateWhatsappConfigDto,
  TestWhatsappDto,
  TwilioWebhookPayload
} from './dto/whatsapp-config.dto';
import { WhatsappWebhookPayload } from './interfaces/whatsapp-webhook.interface';

@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly whatsappService: WhatsappService) {}

  // Webhook verification (Meta requirement)
  @Public()
  @Get('webhook')
  @HttpCode(200)
  async verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') verifyToken: string,
  ) {
    this.logger.log(`Meta webhook verification: mode=${mode}, token=${verifyToken}`);
    
    if (mode === 'subscribe') {
      const isValid = await this.whatsappService.verifyWebhookToken(verifyToken);
      if (isValid) {
        this.logger.log('Meta webhook verification successful');
        return challenge;
      }
    }
    
    throw new BadRequestException('Meta webhook verification failed');
  }

  // Webhook for receiving messages from Meta
  @Public()
  @Post('webhook')
  @HttpCode(200)
  async handleMetaWebhook(
    @Body() payload: WhatsappWebhookPayload,
    @Headers('x-hub-signature-256') signature: string,
  ) {
    this.logger.log('Received Meta WhatsApp webhook', { 
      entries: payload.entry?.length || 0 
    });

    try {
      // Verify webhook signature (security)
      await this.whatsappService.verifyWebhookSignature(payload, signature);
      
      // Process the webhook
      await this.whatsappService.processMetaWebhook(payload);
      
      return { status: 'ok' };
    } catch (error) {
      this.logger.error('Error processing Meta webhook', error);
      throw new BadRequestException('Meta webhook processing failed');
    }
  }

  // Webhook for receiving messages from Twilio
  @Public()
  @Post('webhook/twilio')
  @HttpCode(200)
  async handleTwilioWebhook(
    @Body() payload: TwilioWebhookPayload,
    @Headers('x-twilio-signature') signature: string,
  ) {
    this.logger.log('Received Twilio webhook', {
      from: payload.From,
      to: payload.To,
      body: payload.Body?.substring(0, 50) + '...'
    });

    try {
      // Verificar signature de Twilio (opcional para testing)
      // await this.whatsappService.verifyTwilioSignature(payload, signature);
      
      // Procesar mensaje de Twilio
      await this.whatsappService.processTwilioWebhook(payload);
      
      return { status: 'ok' };
    } catch (error) {
      this.logger.error('Error processing Twilio webhook', error);
      throw new BadRequestException('Twilio webhook processing failed');
    }
  }

  // Get WhatsApp configuration for tenant
  @Get('config')
  async getWhatsappConfig(@User('tenantId') tenantId: string) {
    return this.whatsappService.getWhatsappConfig(tenantId);
  }

  // Update WhatsApp configuration
  @Put('config')
  async updateWhatsappConfig(
    @User('tenantId') tenantId: string,
    @Body() updateDto: UpdateWhatsappConfigDto,
  ) {
    return this.whatsappService.updateWhatsappConfig(tenantId, updateDto);
  }

  // Test WhatsApp configuration
  @Post('test')
  async testWhatsappConfig(
    @User('tenantId') tenantId: string,
    @Body() testDto: TestWhatsappDto,
  ) {
    return this.whatsappService.testWhatsappConfig(tenantId, testDto);
  }

  // Get WhatsApp conversations for tenant
  @Get('conversations')
  async getWhatsappConversations(
    @User('tenantId') tenantId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.whatsappService.getWhatsappConversations(tenantId, limitNum);
  }

  // Send manual message (for testing or admin use)
  @Post('send-message')
  async sendMessage(
    @User('tenantId') tenantId: string,
    @Body() messageData: { to: string; message: string },
  ) {
    return this.whatsappService.sendMessage(
      tenantId,
      messageData.to,
      messageData.message,
    );
  }

  // Get available providers
  @Public()
  @Get('providers')
  async getAvailableProviders() {
    return {
      providers: [
        {
          id: 'cloud_api',
          name: 'Meta Business Cloud API',
          description: 'Oficial de Meta, 1000 mensajes gratis/mes',
          status: 'available',
          requirements: ['Business verification', 'Meta app setup']
        },
        {
          id: 'twilio',
          name: 'Twilio WhatsApp API',
          description: 'Fácil setup, sandbox gratuito para testing',
          status: 'available', 
          requirements: ['Twilio account', 'Phone verification']
        }
      ]
    };
  }
}