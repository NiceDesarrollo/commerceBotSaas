import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { UpdateWhatsappConfigDto, TestWhatsappDto, TwilioWebhookPayload } from './dto/whatsapp-config.dto';
import { WhatsappWebhookPayload } from './interfaces/whatsapp-webhook.interface';
export declare class WhatsappService {
    private prisma;
    private configService;
    private aiService;
    private readonly logger;
    private readonly WHATSAPP_API_URL;
    constructor(prisma: PrismaService, configService: ConfigService, aiService: AiService);
    getWhatsappConfig(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        whatsappPhoneNumberId: string;
        whatsappProvider: string;
        isWhatsappEnabled: boolean;
        hasAccessToken: boolean;
        hasWebhookToken: boolean;
        twilioPhoneNumber: string;
        hasTwilioCredentials: boolean;
    }>;
    updateWhatsappConfig(tenantId: string, updateDto: UpdateWhatsappConfigDto): Promise<{
        whatsappAccessToken: any;
        twilioAuthToken: any;
        hasAccessToken: boolean;
        hasWebhookToken: boolean;
        hasTwilioCredentials: boolean;
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
        id: string;
        tenantId: string;
        botName: string;
        promptStyle: string;
        greeting: string;
        temperature: number;
        useImages: boolean;
        aiProvider: string;
        aiModel: string | null;
        whatsappPhoneNumberId: string | null;
        whatsappWebhookToken: string | null;
        whatsappProvider: string;
        isWhatsappEnabled: boolean;
        twilioAccountSid: string | null;
        twilioPhoneNumber: string | null;
    }>;
    testWhatsappConfig(tenantId: string, testDto: TestWhatsappDto): Promise<{
        success: boolean;
        message: string;
        messageId: string;
        testPhone: string;
        testMessage: string;
        provider: string;
    }>;
    verifyWebhookToken(token: string): Promise<boolean>;
    verifyWebhookSignature(payload: any, signature: string): Promise<boolean>;
    processMetaWebhook(payload: WhatsappWebhookPayload): Promise<void>;
    processTwilioWebhook(payload: TwilioWebhookPayload): Promise<void>;
    private processMetaMessages;
    private processUnifiedMessage;
    private findTenantByTwilioNumber;
    sendMessage(tenantId: string, to: string, text: string): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    private sendMessageViaMeta;
    private sendMessageViaTwilio;
    getWhatsappConversations(tenantId: string, limit?: number): Promise<{
        conversations: Record<string, any[]>;
        totalMessages: number;
        clients: number;
    }>;
}
