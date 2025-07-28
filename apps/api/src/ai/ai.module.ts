import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AiProviderService } from "./services/ai-provider.service";
import { GeminiProvider } from "./providers/gemini.provider";
import { OpenAiProvider } from "./providers/openai.provider";

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    PrismaService,
    AiProviderService,
    GeminiProvider,
    OpenAiProvider,
  ],
  exports: [AiService, AiProviderService],
})
export class AiModule {} 