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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WhatsappController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappController = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp.service");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const user_decorator_1 = require("../auth/decorators/user.decorator");
const whatsapp_config_dto_1 = require("./dto/whatsapp-config.dto");
let WhatsappController = WhatsappController_1 = class WhatsappController {
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
        this.logger = new common_1.Logger(WhatsappController_1.name);
    }
    async verifyWebhook(mode, challenge, verifyToken) {
        this.logger.log(`Meta webhook verification: mode=${mode}, token=${verifyToken}`);
        if (mode === 'subscribe') {
            const isValid = await this.whatsappService.verifyWebhookToken(verifyToken);
            if (isValid) {
                this.logger.log('Meta webhook verification successful');
                return challenge;
            }
        }
        throw new common_1.BadRequestException('Meta webhook verification failed');
    }
    async handleMetaWebhook(payload, signature) {
        this.logger.log('Received Meta WhatsApp webhook', {
            entries: payload.entry?.length || 0
        });
        try {
            await this.whatsappService.verifyWebhookSignature(payload, signature);
            await this.whatsappService.processMetaWebhook(payload);
            return { status: 'ok' };
        }
        catch (error) {
            this.logger.error('Error processing Meta webhook', error);
            throw new common_1.BadRequestException('Meta webhook processing failed');
        }
    }
    async handleTwilioWebhook(payload, signature) {
        this.logger.log('Received Twilio webhook', {
            from: payload.From,
            to: payload.To,
            body: payload.Body?.substring(0, 50) + '...'
        });
        try {
            await this.whatsappService.processTwilioWebhook(payload);
            return { status: 'ok' };
        }
        catch (error) {
            this.logger.error('Error processing Twilio webhook', error);
            throw new common_1.BadRequestException('Twilio webhook processing failed');
        }
    }
    async getWhatsappConfig(tenantId) {
        return this.whatsappService.getWhatsappConfig(tenantId);
    }
    async updateWhatsappConfig(tenantId, updateDto) {
        return this.whatsappService.updateWhatsappConfig(tenantId, updateDto);
    }
    async testWhatsappConfig(tenantId, testDto) {
        return this.whatsappService.testWhatsappConfig(tenantId, testDto);
    }
    async getWhatsappConversations(tenantId, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 50;
        return this.whatsappService.getWhatsappConversations(tenantId, limitNum);
    }
    async sendMessage(tenantId, messageData) {
        return this.whatsappService.sendMessage(tenantId, messageData.to, messageData.message);
    }
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
};
exports.WhatsappController = WhatsappController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('webhook'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('hub.mode')),
    __param(1, (0, common_1.Query)('hub.challenge')),
    __param(2, (0, common_1.Query)('hub.verify_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "verifyWebhook", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-hub-signature-256')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "handleMetaWebhook", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('webhook/twilio'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-twilio-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "handleTwilioWebhook", null);
__decorate([
    (0, common_1.Get)('config'),
    __param(0, (0, user_decorator_1.User)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "getWhatsappConfig", null);
__decorate([
    (0, common_1.Put)('config'),
    __param(0, (0, user_decorator_1.User)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, whatsapp_config_dto_1.UpdateWhatsappConfigDto]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "updateWhatsappConfig", null);
__decorate([
    (0, common_1.Post)('test'),
    __param(0, (0, user_decorator_1.User)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, whatsapp_config_dto_1.TestWhatsappDto]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "testWhatsappConfig", null);
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, user_decorator_1.User)('tenantId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "getWhatsappConversations", null);
__decorate([
    (0, common_1.Post)('send-message'),
    __param(0, (0, user_decorator_1.User)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "sendMessage", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('providers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "getAvailableProviders", null);
exports.WhatsappController = WhatsappController = WhatsappController_1 = __decorate([
    (0, common_1.Controller)('whatsapp'),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], WhatsappController);
//# sourceMappingURL=whatsapp.controller.js.map