export interface WhatsappWebhookPayload {
    object: string;
    entry: WhatsappWebhookEntry[];
}
export interface WhatsappWebhookEntry {
    id: string;
    changes: WhatsappWebhookChange[];
}
export interface WhatsappWebhookChange {
    value: WhatsappWebhookValue;
    field: string;
}
export interface WhatsappWebhookValue {
    messaging_product: string;
    metadata: {
        display_phone_number: string;
        phone_number_id: string;
    };
    contacts?: WhatsappContact[];
    messages?: WhatsappMessage[];
    statuses?: WhatsappMessageStatus[];
}
export interface WhatsappContact {
    profile: {
        name: string;
    };
    wa_id: string;
}
export interface WhatsappMessage {
    from: string;
    id: string;
    timestamp: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contacts';
    text?: {
        body: string;
    };
    image?: {
        id: string;
        mime_type: string;
        sha256: string;
        caption?: string;
    };
}
export interface WhatsappMessageStatus {
    id: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
    recipient_id: string;
    errors?: Array<{
        code: number;
        title: string;
        message: string;
    }>;
}
export interface WhatsappOutgoingMessage {
    messaging_product: 'whatsapp';
    to: string;
    type: 'text' | 'template';
    text?: {
        body: string;
        preview_url?: boolean;
    };
    template?: {
        name: string;
        language: {
            code: string;
        };
        components?: any[];
    };
}
export interface WhatsappApiResponse {
    messages: Array<{
        id: string;
    }>;
    contacts: Array<{
        input: string;
        wa_id: string;
    }>;
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
    ProfileName?: string;
    WaId?: string;
}
export interface UnifiedMessage {
    from: string;
    id: string;
    timestamp: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'document';
    text?: {
        body: string;
    };
    provider: 'meta' | 'twilio';
}
