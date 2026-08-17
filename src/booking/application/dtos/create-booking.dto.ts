import { IsEmail, IsInt, IsNotEmpty, IsPositive, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsUUID('4', { message: 'showtimeId debe ser un UUID v4 válido' })
  @IsNotEmpty({ message: 'showtimeId es requerido' })
  showtimeId!: string;

  @IsString()
  @IsNotEmpty({ message: 'customerName es requerido' })
  customerName!: string;

  @IsEmail({}, { message: 'customerEmail debe ser un email válido' })
  @IsNotEmpty({ message: 'customerEmail es requerido' })
  customerEmail!: string;

  @Type(() => Number)
  @IsInt({ message: 'seatsBooked debe ser un número entero' })
  @IsPositive({ message: 'seatsBooked debe ser mayor que 0' })
  @Min(1, { message: 'Debes reservar al menos 1 asiento' })
  seatsBooked!: number;
}