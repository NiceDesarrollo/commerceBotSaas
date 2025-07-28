import { ConfigService } from '@nestjs/config';
import { AiProvider, AiConfig, AiResponse } from '../interfaces/ai-provider.interface';
export declare class OpenAiProvider implements AiProvider {
    private configService;
    private openai;
    private isConfigured;
    constructor(configService: ConfigService);
    generateResponse(prompt: string, config?: AiConfig): Promise<AiResponse>;
    getName(): string;
    isAvailable(): boolean;
}
