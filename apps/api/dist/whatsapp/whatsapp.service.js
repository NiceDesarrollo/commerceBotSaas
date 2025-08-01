"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
const crypto = require("crypto");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    constructor(prisma, configService, aiService) {
        this.prisma = prisma;
        this.configService = configService;
        this.aiService = aiService;
        this.logger = new common_1.Logger(WhatsappService_1.name);
        this.WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';
    }
    async getWhatsappConfig(tenantId) {
        try {
            const botConfig = await this.aiService.getBotConfig(tenantId);
            return {
                id: botConfig.id,
                tenantId: botConfig.tenantId,
                whatsappPhoneNumberId: botConfig.whatsappPhoneNumberId,
                whatsappProvider: botConfig.whatsappProvider,
                isWhatsappEnabled: botConfig.isWhatsappEnabled,
                hasAccessToken: !!botConfig.whatsappAccessToken,
                hasWebhookToken: !!botConfig.whatsappWebhookToken,
                twilioPhoneNumber: botConfig.twilioPhoneNumber,
                hasTwilioCredentials: !!(botConfig.twilioAccountSid && botConfig.twilioAuthToken),
            };
        }
        catch (error) {
            this.logger.error('Error getting WhatsApp config', error);
            throw new common_1.BadRequestException('Error al obtener configuración de WhatsApp');
        }
    }
    async updateWhatsappConfig(tenantId, updateDto) {
        try {
            const currentConfig = await this.aiService.getBotConfig(tenantId);
            const updatedConfig = await this.prisma.botConfig.update({
                where: { tenantId },
                data: {
                    whatsappPhoneNumberId: updateDto.whatsappPhoneNumberId,
                    whatsappAccessToken: updateDto.whatsappAccessToken,
                    whatsappWebhookToken: updateDto.whatsappWebhookToken,
                    whatsappProvider: updateDto.whatsappProvider || 'cloud_api',
                    isWhatsappEnabled: updateDto.isWhatsappEnabled,
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
            return {
                ...updatedConfig,
                whatsappAccessToken: undefined,
                twilioAuthToken: undefined,
                hasAccessToken: !!updatedConfig.whatsappAccessToken,
                hasWebhookToken: !!updatedConfig.whatsappWebhookToken,
                hasTwilioCredentials: !!(updatedConfig.twilioAccountSid && updatedConfig.twilioAuthToken),
            };
        }
        catch (error) {
            this.logger.error('Error updating WhatsApp config', error);
            throw new common_1.BadRequestException('Error al actualizar configuración de WhatsApp');
        }
    }
    async testWhatsappConfig(tenantId, testDto) {
        try {
            const config = await this.prisma.botConfig.findUnique({
                where: { tenantId },
            });
            if (!config?.isWhatsappEnabled) {
                throw new common_1.BadRequestException('WhatsApp no está habilitado');
            }
            if (config.whatsappProvider === 'twilio') {
                if (!config.twilioAccountSid || !config.twilioAuthToken) {
                    throw new common_1.BadRequestException('Credenciales de Twilio no configuradas');
                }
            }
            else if (config.whatsappProvider === 'cloud_api') {
                if (!config.whatsappAccessToken || !config.whatsappPhoneNumberId) {
                    throw new common_1.BadRequestException('Meta WhatsApp no está configurado correctamente');
                }
            }
            const testPhone = testDto.testPhoneNumber || '+5215551234567';
            const result = await this.sendMessage(tenantId, testPhone, testDto.testMessage);
            return {
                success: true,
                message: 'Mensaje de prueba enviado correctamente',
                messageId: result.messageId,
                testPhone,
                testMessage: testDto.testMessage,
                provider: config.whatsappProvider,
            };
        }
        catch (error) {
            this.logger.error('Error testing WhatsApp config', error);
            throw new common_1.BadRequestException('Error en la prueba de WhatsApp: ' + error.message);
        }
    }
    async verifyWebhookToken(token) {
        try {
            const config = await this.prisma.botConfig.findFirst({
                where: {
                    whatsappWebhookToken: token,
                    whatsappProvider: 'cloud_api',
                    isWhatsappEnabled: true,
                },
            });
            return !!config;
        }
        catch (error) {
            this.logger.error('Error verifying webhook token', error);
            return false;
        }
    }
    async verifyWebhookSignature(payload, signature) {
        try {
            if (!signature)
                return true;
            const appSecret = this.configService.get('WHATSAPP_APP_SECRET');
            if (!appSecret)
                return true;
            const expectedSignature = crypto
                .createHmac('sha256', appSecret)
                .update(JSON.stringify(payload))
                .digest('hex');
            return signature === `sha256=${expectedSignature}`;
        }
        catch (error) {
            this.logger.error('Error verifying webhook signature', error);
            return false;
        }
    }
    async processMetaWebhook(payload) {
        try {
            for (const entry of payload.entry || []) {
                for (const change of entry.changes || []) {
                    if (change.field === 'messages') {
                        await this.processMetaMessages(change.value);
                    }
                }
            }
        }
        catch (error) {
            this.logger.error('Error processing Meta webhook', error);
            throw error;
        }
    }
    async processTwilioWebhook(payload) {
        try {
            const from = payload.From?.replace('whatsapp:', '');
            const to = payload.To?.replace('whatsapp:', '');
            const message = payload.Body;
            if (!from || !message) {
                this.logger.warn('Invalid Twilio webhook payload', payload);
                return;
            }
            this.logger.log(`Processing Twilio message from ${from}: ${message}`);
            const config = await this.findTenantByTwilioNumber(to);
            if (!config) {
                this.logger.warn(`No tenant found for Twilio number: ${to}`);
                return;
            }
            const unifiedMessage = {
                from,
                id: payload.MessageSid,
                timestamp: new Date().toISOString(),
                type: 'text',
                text: { body: message },
                provider: 'twilio'
            };
            await this.processUnifiedMessage(config.tenantId, unifiedMessage);
        }
        catch (error) {
            this.logger.error('Error processing Twilio webhook', error);
        }
    }
    async processMetaMessages(value) {
        try {
            const phoneNumberId = value.metadata?.phone_number_id;
            if (!phoneNumberId)
                return;
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
            for (const message of value.messages || []) {
                const unifiedMessage = {
                    from: message.from,
                    id: message.id,
                    timestamp: message.timestamp,
                    type: message.type,
                    text: message.text,
                    provider: 'meta'
                };
                await this.processUnifiedMessage(config.tenantId, unifiedMessage);
            }
        }
        catch (error) {
            this.logger.error('Error processing Meta messages', error);
        }
    }
    async processUnifiedMessage(tenantId, message) {
        try {
            if (message.type !== 'text') {
                this.logger.log(`Unsupported message type: ${message.type}`);
                return;
            }
            const userMessage = message.text?.body;
            const userPhone = message.from;
            if (!userMessage || !userPhone)
                return;
            this.logger.log(`Processing message from ${userPhone}: ${userMessage} (via ${message.provider})`);
            const aiResponse = await this.aiService.sendMessage(tenantId, {
                message: userMessage,
                conversationId: userPhone,
                clientPhone: userPhone,
            });
            await this.sendMessage(tenantId, userPhone, aiResponse.response);
        }
        catch (error) {
            this.logger.error('Error processing unified message', error);
            try {
                await this.sendMessage(tenantId, message.from, 'Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.');
            }
            catch (sendError) {
                this.logger.error('Error sending error message', sendError);
            }
        }
    }
    async findTenantByTwilioNumber(twilioNumber) {
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
    async sendMessage(tenantId, to, text) {
        try {
            const config = await this.prisma.botConfig.findUnique({
                where: { tenantId },
            });
            if (!config?.isWhatsappEnabled) {
                throw new Error('WhatsApp no configurado');
            }
            if (config.whatsappProvider === 'twilio') {
                return await this.sendMessageViaTwilio(config, to, text);
            }
            else {
                return await this.sendMessageViaMeta(config, to, text);
            }
        }
        catch (error) {
            this.logger.error('Error sending WhatsApp message', error);
            throw new common_1.InternalServerErrorException('Error enviando mensaje de WhatsApp');
        }
    }
    async sendMessageViaMeta(config, to, text) {
        if (!config?.whatsappAccessToken || !config?.whatsappPhoneNumberId) {
            throw new Error('Meta WhatsApp no configurado');
        }
        const messagePayload = {
            messaging_product: 'whatsapp',
            to: to.replace(/\D/g, ''),
            type: 'text',
            text: {
                body: text,
                preview_url: true,
            },
        };
        const response = await fetch(`${this.WHATSAPP_API_URL}/${config.whatsappPhoneNumberId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.whatsappAccessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messagePayload),
        });
        if (!response.ok) {
            const errorData = await response.text();
            this.logger.error('Meta WhatsApp API error', { status: response.status, error: errorData });
            throw new Error(`Meta WhatsApp API error: ${response.status}`);
        }
        const result = await response.json();
        const messageId = result.messages?.[0]?.id;
        this.logger.log(`Message sent via Meta`, { messageId, to });
        return {
            success: true,
            messageId,
        };
    }
    async sendMessageViaTwilio(config, to, text) {
        if (!config?.twilioAccountSid || !config?.twilioAuthToken) {
            throw new Error('Twilio WhatsApp no configurado');
        }
        const twilio = require('twilio');
        const client = twilio(config.twilioAccountSid, config.twilioAuthToken);
        try {
            const message = await client.messages.create({
                body: text,
                from: 'whatsapp:+14155238886',
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
        }
        catch (error) {
            this.logger.error('Twilio API error', error);
            throw new Error(`Twilio API error: ${error.message}`);
        }
    }
    async getWhatsappConversations(tenantId, limit = 50) {
        try {
            return await this.aiService.getConversations(tenantId, limit);
        }
        catch (error) {
            this.logger.error('Error getting WhatsApp conversations', error);
            throw new common_1.BadRequestException('Error al obtener conversaciones de WhatsApp');
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        ai_service_1.AiService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map