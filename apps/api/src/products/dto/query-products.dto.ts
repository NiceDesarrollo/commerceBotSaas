import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryProductsDto {
  @IsOptional()
  @IsString()
  search?: string; // Búsqueda por nombre o descripción

  @IsOptional()
  @IsString()
  category?: string; // Filtrar por categoría

  @IsOptional()
  @IsNumber({}, { message: 'El precio mínimo debe ser un número' })
  @Min(0, { message: 'El precio mínimo debe ser mayor o igual a 0' })
  @Transform(({ value }) => parseFloat(value))
  minPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El precio máximo debe ser un número' })
  @Min(0, { message: 'El precio máximo debe ser mayor o igual a 0' })
  @Transform(({ value }) => parseFloat(value))
  maxPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El stock mínimo debe ser un número' })
  @Min(0, { message: 'El stock mínimo debe ser mayor o igual a 0' })
  @Transform(({ value }) => parseInt(value))
  minStock?: number;

  @IsOptional()
  @IsString()
  tags?: string; // Tags separados por comas

  @IsOptional()
  @IsString()
  sortBy?: string; // Campo para ordenar: name, price, stock, createdAt

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc'; // Orden: ascendente o descendente

  // Paginación
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser un número' })
  @Min(1, { message: 'La página debe ser mayor a 0' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite debe ser mayor a 0' })
  @Max(100, { message: 'El límite no puede ser mayor a 100' })
  limit?: number = 10;
}

export class UpdateStockDto {
  @IsNumber({}, { message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock debe ser mayor o igual a 0' })
  @Transform(({ value }) => parseInt(value))
  stock: number;

  @IsOptional()
  @IsString()
  operation?: 'set' | 'add' | 'subtract' = 'set'; // Operación a realizar
} 