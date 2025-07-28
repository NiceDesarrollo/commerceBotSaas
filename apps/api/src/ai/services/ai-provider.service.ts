import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider, AiConfig, AiResponse } from '../interfaces/ai-provider.interface';
import { GeminiProvider } from '../providers/gemini.provider';
import { OpenAiProvider } from '../providers/openai.provider';

@Injectable()
export class AiProviderService {
  private providers: AiProvider[] = [];
  private primaryProvider: string;

  constructor(
    private configService: ConfigService,
    private geminiProvider: GeminiProvider,
    private openaiProvider: OpenAiProvider,
  ) {
    // Registrar proveedores disponibles
    this.providers = [this.geminiProvider, this.openaiProvider];
    
    // Configurar proveedor primario (configurable por env)
    this.primaryProvider = this.configService.get<string>('PRIMARY_AI_PROVIDER') || 'gemini';
  }

  async generateResponse(prompt: string, config?: AiConfig): Promise<AiResponse> {
    // Intentar con el proveedor primario primero
    const primary = this.getProvider(this.primaryProvider);
    if (primary && primary.isAvailable()) {
      try {
        return await primary.generateResponse(prompt, config);
      } catch (error) {
        console.warn(`Proveedor primario ${this.primaryProvider} falló, intentando fallback...`, error.message);
      }
    }

    // Fallback: intentar con otros proveedores disponibles
    for (const provider of this.providers) {
      if (provider.getName().toLowerCase() !== this.primaryProvider && provider.isAvailable()) {
        try {
          const response = await provider.generateResponse(prompt, config);
          console.info(`Usando proveedor de fallback: ${provider.getName()}`);
          return response;
        } catch (error) {
          console.warn(`Proveedor ${provider.getName()} falló:`, error.message);
        }
      }
    }

    throw new Error('Ningún proveedor de IA está disponible');
  }

  getAvailableProviders(): string[] {
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

  private getProvider(name: string): AiProvider | undefined {
    return this.providers.find(p => p.getName().toLowerCase() === name.toLowerCase());
  }
} 