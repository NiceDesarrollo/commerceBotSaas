import { IsString, IsOptional, IsNumber, IsBoolean, Min, Max, MaxLength, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBotConfigDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: "El nombre del bot no puede exceder 100 caracteres",
  })
  botName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: "El estilo de prompt no puede exceder 500 caracteres",
  })
  promptStyle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: "El mensaje de saludo no puede exceder 500 caracteres",
  })
  greeting?: string;

  @IsOptional()
  @IsNumber({}, { message: "La temperatura debe ser un número" })
  @Min(0, { message: "La temperatura debe ser mayor o igual a 0" })
  @Max(2, { message: "La temperatura debe ser menor o igual a 2" })
  @Transform(({ value }) => parseFloat(value))
  temperature?: number;

  @IsOptional()
  @IsBoolean({ message: "useImages debe ser un booleano" })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
    return Boolean(value);
  })
  useImages?: boolean;

  @IsOptional()
  @IsString()
  aiProvider?: "gemini" | "openai" | "auto";

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: "El modelo de IA no puede exceder 50 caracteres" })
  aiModel?: string;
}

export class TestBotConfigDto {
  @IsString()
  @IsNotEmpty({ message: 'El mensaje de prueba es requerido' })
  @MaxLength(1000, { message: 'El mensaje de prueba no puede exceder 1000 caracteres' })
  testMessage: string;
} 