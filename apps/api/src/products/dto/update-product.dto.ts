import { IsString, IsOptional, IsNumber, IsArray, IsUrl, Min, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'La descripción no puede exceder 1000 caracteres' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'La categoría no puede exceder 100 caracteres' })
  category?: string;

  @IsOptional()
  @IsUrl({}, { message: 'La URL de imagen debe ser válida' })
  imageUrl?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock debe ser mayor o igual a 0' })
  @Transform(({ value }) => parseInt(value))
  stock?: number;

  @IsOptional()
  @IsArray({ message: 'Los tags deben ser un array' })
  @IsString({ each: true, message: 'Cada tag debe ser una cadena de texto' })
  tags?: string[];
} 