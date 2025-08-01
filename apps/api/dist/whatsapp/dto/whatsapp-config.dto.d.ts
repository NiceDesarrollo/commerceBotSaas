export declare class WhatsappConfigDto {
    whatsappPhoneNumberId?: string;
    whatsappAccessToken?: string;
    whatsappWebhookToken?: string;
    whatsappProvider?: string;
    isWhatsappEnabled?: boolean;
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioPhoneNumber?: string;
}
export declare class UpdateWhatsappConfigDto extends WhatsappConfigDto {
}
export declare class TestWhatsappDto {
    testMessage: string;
    testPhoneNumber?: string;
}
export interface TwilioWebhookPayload {
    MessageSid: string;
    AccountSid: string;
    From: string;
    To: string;
    Body: string;
    NumMedia?: string;
    MediaUrl0?: string;
    MediaContentType0?: string;
}
