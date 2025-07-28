export declare class ChatMessageDto {
    message: string;
    clientPhone?: string;
    conversationId?: string;
    context?: string[];
}
export declare class ChatResponseDto {
    response: string;
    conversationId: string;
    timestamp: Date;
    tokensUsed?: number;
    model: string;
    provider?: string;
}
