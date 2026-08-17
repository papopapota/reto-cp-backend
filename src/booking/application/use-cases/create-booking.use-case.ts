import { Inject, Injectable } from '@nestjs/common';
import { SHOWTIME_REPOSITORY_PORT, type ShowtimeRepositoryPort } from 'src/showtime/domain/ports';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { Booking } from 'src/booking/domain/entities';
import { InsufficientSeatsException } from 'src/booking/domain/exceptions';
import { BOOKING_REPOSITORY_PORT, type BookingRepositoryPort } from '../../domain/ports';
import { ShowtimeClosedException, ShowtimeNotFoundException } from 'src/showtime/domain/exceptions';

@Injectable()
export class CreateBookingUseCase {
    constructor(
        @Inject(BOOKING_REPOSITORY_PORT)
        private readonly bookingRepository: BookingRepositoryPort,
        @Inject(SHOWTIME_REPOSITORY_PORT)
        private readonly showtimeRepository: ShowtimeRepositoryPort,
    ) { }
    /**
       * Valida las reglas de negocio y procesa la reserva de forma atómica.
       *
       * @param dto - Objeto de transferencia con los datos de compra del usuario.
       * @returns La entidad `Booking` creada y persistida en base de datos.
       *
       * @throws {ShowtimeNotFoundException} Si la función no existe o fue eliminada lógicamente.
       * @throws {ShowtimeClosedException} Si la fecha de la función es anterior a la fecha actual.
       * @throws {InsufficientSeatsException} Si la cantidad solicitada supera los asientos disponibles en la sala.
       */
    async execute(dto: CreateBookingDto): Promise<Booking> {
        const { showtimeId, customerName, customerEmail, seatsBooked } = dto;
        const showtime = await this.showtimeRepository.findById(showtimeId);
        if (!showtime) {
            throw new ShowtimeNotFoundException();
        }
        if (showtime.getDateTime() < new Date()) {
            throw new ShowtimeClosedException();
        }
        if (showtime.getAvailableSeats() < seatsBooked) {
            throw new InsufficientSeatsException();
        }
        const totalPrice = showtime.getPrice() * seatsBooked;
        const bookingData = {
            customerName,
            customerEmail,
            seatsBooked,
            totalPrice,
        };
        const booking = await this.bookingRepository.createWithSeatReservation({
            showtimeId,
            seatsToDeduct: seatsBooked,
            bookingData
        });
        return booking;
    }
}