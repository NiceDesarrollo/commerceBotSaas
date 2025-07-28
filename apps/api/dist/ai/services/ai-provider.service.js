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
exports.AiProviderService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const gemini_provider_1 = require("../providers/gemini.provider");
const openai_provider_1 = require("../providers/openai.provider");
let AiProviderService = class AiProviderService {
    constructor(configService, geminiProvider, openaiProvider) {
        this.configService = configService;
        this.geminiProvider = geminiProvider;
        this.openaiProvider = openaiProvider;
        this.providers = [];
        this.providers = [this.geminiProvider, this.openaiProvider];
        this.primaryProvider = this.configService.get('PRIMARY_AI_PROVIDER') || 'gemini';
    }
    async generateResponse(prompt, config) {
        const primary = this.getProvider(this.primaryProvider);
        if (primary && primary.isAvailable()) {
            try {
                return await primary.generateResponse(prompt, config);
            }
            catch (error) {
                console.warn(`Proveedor primario ${this.primaryProvider} falló, intentando fallback...`, error.message);
            }
        }
        for (const provider of this.providers) {
            if (provider.getName().toLowerCase() !== this.primaryProvider && provider.isAvailable()) {
                try {
                    const response = await provider.generateResponse(prompt, config);
                    console.info(`Usando proveedor de fallback: ${provider.getName()}`);
                    return response;
                }
                catch (error) {
                    console.warn(`Proveedor ${provider.getName()} falló:`, error.message);
                }
            }
        }
        throw new Error('Ningún proveedor de IA está disponible');
    }
    getAvailableProviders() {
        return this.providers
            .filter(provider => provider.isAvailable())
            .map(provider => provider.getName());
    }
    getProviderStatus() {
        return {
            primaryProvider: this.primaryProvider,
            availableProviders: this.getAvailableProviders(),
            providers: this.providers.map(p => ({
                name: p.getName(),
                available: p.isAvailable(),
            })),
        };
    }
    getProvider(name) {
        return this.providers.find(p => p.getName().toLowerCase() === name.toLowerCase());
    }
};
exports.AiProviderService = AiProviderService;
exports.AiProviderService = AiProviderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        gemini_provider_1.GeminiProvider,
        openai_provider_1.OpenAiProvider])
], AiProviderService);
//# sourceMappingURL=ai-provider.service.js.map