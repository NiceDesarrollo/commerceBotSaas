export interface AiProvider {
  generateResponse(prompt: string, config?: AiConfig): Promise<AiResponse>;
  getName(): string;
  isAvailable(): boolean;
}

export interface AiConfig {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AiResponse {
  text: string;
  tokensUsed: number;
  model: string;
  provider: string;
} 