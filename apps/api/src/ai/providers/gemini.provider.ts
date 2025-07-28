import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { AiProvider, AiConfig, AiResponse } from '../interfaces/ai-provider.interface';

@Injectable()
export class GeminiProvider implements AiProvider {
  private genAI: GoogleGenAI;
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenAI({});
      this.isConfigured = true;
    }
  }

  async generateResponse(prompt: string, config?: AiConfig): Promise<AiResponse> {
    if (!this.isConfigured) {
      throw new Error('Gemini API no está configurada');
    }

    const result = await this.genAI.models.generateContent({
      model: config?.model || "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    return {
      text: result.text,
      tokensUsed: result.usageMetadata?.totalTokenCount || 0,
      model: config?.model || "gemini-2.5-flash",
      provider: 'gemini',
    };
  }

  getName(): string {
    return 'Gemini';
  }

  isAvailable(): boolean {
    return this.isConfigured;
  }
} 