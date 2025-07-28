import { ConfigService } from '@nestjs/config';
import { AiConfig, AiResponse } from '../interfaces/ai-provider.interface';
import { GeminiProvider } from '../providers/gemini.provider';
import { OpenAiProvider } from '../providers/openai.provider';
export declare class AiProviderService {
    private configService;
    private geminiProvider;
    private openaiProvider;
    private providers;
    private primaryProvider;
    constructor(configService: ConfigService, geminiProvider: GeminiProvider, openaiProvider: OpenAiProvider);
    generateResponse(prompt: string, config?: AiConfig): Promise<AiResponse>;
    getAvailableProviders(): string[];
    getProviderStatus(): {
        primaryProvider: string;
        availableProviders: string[];
        providers: {
            name: string;
            available: boolean;
        }[];
    };
    private getProvider;
}
