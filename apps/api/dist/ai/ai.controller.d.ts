import { AiService } from './ai.service';
import { AiProviderService } from "./services/ai-provider.service";
import { ChatMessageDto } from "./dto/chat-message.dto";
import { UpdateBotConfigDto, TestBotConfigDto } from "./dto/bot-config.dto";
import { UserFromToken } from "../auth/decorators/user.decorator";
export declare class AiController {
    private readonly aiService;
    private readonly aiProviderService;
    constructor(aiService: AiService, aiProviderService: AiProviderService);
    sendMessage(chatDto: ChatMessageDto, user: UserFromToken): Promise<import("./dto/chat-message.dto").ChatResponseDto>;
    getBotConfig(user: UserFromToken): Promise<{
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
    updateBotConfig(updateDto: UpdateBotConfigDto, user: UserFromToken): Promise<{
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
    testBotConfig(testDto: TestBotConfigDto, user: UserFromToken): Promise<{
        isTest: boolean;
        testMessage: string;
        response: string;
        conversationId: string;
        timestamp: Date;
        tokensUsed?: number;
        model: string;
        provider?: string;
    }>;
    getConversations(limit: number, user: UserFromToken): Promise<{
        conversations: Record<string, any[]>;
        totalMessages: number;
        clients: number;
    }>;
    getProvidersStatus(): Promise<{
        primaryProvider: string;
        availableProviders: string[];
        providers: {
            name: string;
            available: boolean;
        }[];
    }>;
}
