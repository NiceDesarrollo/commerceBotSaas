import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { ChatMessageDto, ChatResponseDto } from "./dto/chat-message.dto";
import { UpdateBotConfigDto, TestBotConfigDto } from "./dto/bot-config.dto";
import { AiProviderService } from "./services/ai-provider.service";
export declare class AiService {
    private prisma;
    private configService;
    private aiProviderService;
    constructor(prisma: PrismaService, configService: ConfigService, aiProviderService: AiProviderService);
    getBotConfig(tenantId: string): Promise<{
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        tenantId: string;
        id: string;
        botName: string;
        promptStyle: string;
        greeting: string;
        temperature: number;
        useImages: boolean;
    }>;
    updateBotConfig(tenantId: string, updateDto: UpdateBotConfigDto): Promise<{
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        tenantId: string;
        id: string;
        botName: string;
        promptStyle: string;
        greeting: string;
        temperature: number;
        useImages: boolean;
    }>;
    sendMessage(tenantId: string, chatDto: ChatMessageDto): Promise<ChatResponseDto>;
    testBotConfig(tenantId: string, testDto: TestBotConfigDto): Promise<{
        isTest: boolean;
        testMessage: string;
        response: string;
        conversationId: string;
        timestamp: Date;
        tokensUsed?: number;
        model: string;
        provider?: string;
    }>;
    getConversations(tenantId: string, limit?: number): Promise<{
        conversations: Record<string, any[]>;
        totalMessages: number;
        clients: number;
    }>;
    private buildSystemPrompt;
    private getProductsContext;
    private getConversationHistory;
    private saveConversationHistory;
    private generateConversationId;
}
