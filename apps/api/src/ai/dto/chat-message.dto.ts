import { IsString, IsNotEmpty, IsOptional, IsArray, MaxLength } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'El mensaje es requerido' })
  @MaxLength(2000, { message: 'El mensaje no puede exceder 2000 caracteres' })
  message: string;

  @IsOptional()
  @IsString()
  clientPhone?: string; // Teléfono del cliente (para contexto)

  @IsOptional()
  @IsString()
  conversationId?: string; // ID de conversación existente

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  context?: string[]; // Mensajes anteriores para contexto
}

export class ChatResponseDto {
  response: string;
  conversationId: string;
  timestamp: Date;
  tokensUsed?: number;
  model: string;
} 