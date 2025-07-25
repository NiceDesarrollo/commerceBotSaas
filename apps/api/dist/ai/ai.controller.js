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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const chat_message_dto_1 = require("./dto/chat-message.dto");
const bot_config_dto_1 = require("./dto/bot-config.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_decorator_1 = require("../auth/decorators/user.decorator");
let AiController = class AiController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async sendMessage(chatDto, user) {
        return this.aiService.sendMessage(user.tenantId, chatDto);
    }
    async getBotConfig(user) {
        return this.aiService.getBotConfig(user.tenantId);
    }
    async updateBotConfig(updateDto, user) {
        return this.aiService.updateBotConfig(user.tenantId, updateDto);
    }
    async testBotConfig(testDto, user) {
        return this.aiService.testBotConfig(user.tenantId, testDto);
    }
    async getConversations(limit, user) {
        return this.aiService.getConversations(user.tenantId, limit);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('chat'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_message_dto_1.ChatMessageDto, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('bot-config'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getBotConfig", null);
__decorate([
    (0, common_1.Put)('bot-config'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bot_config_dto_1.UpdateBotConfigDto, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "updateBotConfig", null);
__decorate([
    (0, common_1.Post)('bot-config/test'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bot_config_dto_1.TestBotConfigDto, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "testBotConfig", null);
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getConversations", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map