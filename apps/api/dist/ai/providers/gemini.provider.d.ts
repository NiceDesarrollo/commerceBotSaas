import { ConfigService } from '@nestjs/config';
import { AiProvider, AiConfig, AiResponse } from '../interfaces/ai-provider.interface';
export declare class GeminiProvider implements AiProvider {
    private configService;
    private genAI;
    private isConfigured;
    constructor(configService: ConfigService);
    generateResponse(prompt: string, config?: AiConfig): Promise<AiResponse>;
    getName(): string;
    isAvailable(): boolean;
}
