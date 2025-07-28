export declare class UpdateBotConfigDto {
    botName?: string;
    promptStyle?: string;
    greeting?: string;
    temperature?: number;
    useImages?: boolean;
    aiProvider?: "gemini" | "openai" | "auto";
    aiModel?: string;
}
export declare class TestBotConfigDto {
    testMessage: string;
}
