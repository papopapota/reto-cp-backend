import { IsOptional, IsUUID, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryShowtimeDto {
  @IsOptional()
  @IsUUID('4', { message: 'movieId debe ser un UUID v4 válido' })
  movieId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'date debe tener formato ISO-8601 (YYYY-MM-DD)' })
  date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minPrice debe ser un número' })
  @Min(0, { message: 'minPrice no puede ser negativo' })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'maxPrice debe ser un número' })
  @Min(0, { message: 'maxPrice no puede ser negativo' })
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'page debe ser al menos 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100, { message: 'limit no puede superar 100 elementos' })
  limit: number = 10;
}