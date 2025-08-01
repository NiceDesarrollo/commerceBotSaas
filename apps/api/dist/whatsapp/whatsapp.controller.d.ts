import { WhatsappService } from './whatsapp.service';
import { UpdateWhatsappConfigDto, TestWhatsappDto, TwilioWebhookPayload } from './dto/whatsapp-config.dto';
import { WhatsappWebhookPayload } from './interfaces/whatsapp-webhook.interface';
export declare class WhatsappController {
    private readonly whatsappService;
    private readonly logger;
    constructor(whatsappService: WhatsappService);
    verifyWebhook(mode: string, challenge: string, verifyToken: string): Promise<string>;
    handleMetaWebhook(payload: WhatsappWebhookPayload, signature: string): Promise<{
        status: string;
    }>;
    handleTwilioWebhook(payload: TwilioWebhookPayload, signature: string): Promise<{
        status: string;
    }>;
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
    getWhatsappConversations(tenantId: string, limit?: string): Promise<{
        conversations: Record<string, any[]>;
        totalMessages: number;
        clients: number;
    }>;
    sendMessage(tenantId: string, messageData: {
        to: string;
        message: string;
    }): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    getAvailableProviders(): Promise<{
        providers: {
            id: string;
            name: string;
            description: string;
            status: string;
            requirements: string[];
        }[];
    }>;
}
