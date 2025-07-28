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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let OpenAiProvider = class OpenAiProvider {
    constructor(configService) {
        this.configService = configService;
        this.isConfigured = false;
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new openai_1.default({
                apiKey: apiKey,
            });
            this.isConfigured = true;
        }
    }
    async generateResponse(prompt, config) {
        if (!this.isConfigured) {
            throw new Error('OpenAI API no está configurada');
        }
        const completion = await this.openai.chat.completions.create({
            model: config?.model || "gpt-3.5-turbo",
            messages: [
                { role: "user", content: prompt }
            ],
            max_tokens: config?.maxTokens || 1000,
            temperature: config?.temperature || 0.7,
        });
        return {
            text: completion.choices[0].message.content || '',
            tokensUsed: completion.usage?.total_tokens || 0,
            model: config?.model || "gpt-3.5-turbo",
            provider: 'openai',
        };
    }
    getName() {
        return 'OpenAI';
    }
    isAvailable() {
        return this.isConfigured;
    }
};
exports.OpenAiProvider = OpenAiProvider;
exports.OpenAiProvider = OpenAiProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenAiProvider);
//# sourceMappingURL=openai.provider.js.map