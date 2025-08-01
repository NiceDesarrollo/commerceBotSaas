import { IsString, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class WhatsappConfigDto {
  @IsOptional()
  @IsString()
  whatsappPhoneNumberId?: string;

  @IsOptional()
  @IsString()
  whatsappAccessToken?: string;

  @IsOptional()
  @IsString()
  whatsappWebhookToken?: string;

  @IsOptional()
  @IsIn(['none', 'cloud_api', 'twilio', '360dialog'])
  whatsappProvider?: string;

  @IsOptional()
  @IsBoolean()
  isWhatsappEnabled?: boolean;

  // Twilio Configuration
  @IsOptional()
  @IsString()
  twilioAccountSid?: string;

  @IsOptional()
  @IsString()
  twilioAuthToken?: string;

  @IsOptional()
  @IsString()
  twilioPhoneNumber?: string;
}

export class UpdateWhatsappConfigDto extends WhatsappConfigDto {}

export class TestWhatsappDto {
  @IsString()
  testMessage: string;

  @IsOptional()
  @IsString()
  testPhoneNumber?: string; // Para testing específico
}

// Twilio Webhook Payload Interface
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