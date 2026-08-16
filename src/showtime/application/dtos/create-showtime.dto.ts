import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShowtimeDto {
  @IsUUID('4', { message: 'movieId debe ser un UUID v4 válido' })
  @IsNotEmpty({ message: 'movieId es requerido' })
  movieId!: string;

  @IsString({ message: 'room debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'room es requerido' })
  room!: string;

  @IsDateString({}, { message: 'dateTime debe tener formato ISO-8601 válido' })
  @IsNotEmpty({ message: 'dateTime es requerido' })
  dateTime!: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'price debe ser un número' })
  @IsPositive({ message: 'price debe ser mayor a 0' })
  price!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'totalSeats debe ser un número entero' })
  @Min(1, { message: 'totalSeats debe tener al menos 1 asiento' })
  totalSeats!: number;
}