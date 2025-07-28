import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AiProvider, AiConfig, AiResponse } from '../interfaces/ai-provider.interface';

@Injectable()
export class OpenAiProvider implements AiProvider {
  private openai: OpenAI;
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
      this.isConfigured = true;
    }
  }

  async generateResponse(prompt: string, config?: AiConfig): Promise<AiResponse> {
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

  getName(): string {
    return 'OpenAI';
  }

  isAvailable(): boolean {
    return this.isConfigured;
  }
} 