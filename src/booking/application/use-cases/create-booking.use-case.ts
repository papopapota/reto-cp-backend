import { Inject, Injectable } from '@nestjs/common';
import { SHOWTIME_REPOSITORY_PORT, type ShowtimeRepositoryPort } from 'src/showtime/domain/ports';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { Booking } from 'src/booking/domain/entities';
import { InsufficientSeatsException } from 'src/booking/domain/exceptions';
import { BOOKING_REPOSITORY_PORT, type BookingRepositoryPort } from '../ports';
import { ShowtimeClosedException, ShowtimeNotFoundException } from 'src/showtime/domain/exceptions';

@Injectable()
export class CreateBookingUseCase {
    constructor(
        @Inject(BOOKING_REPOSITORY_PORT)
        private readonly bookingRepository: BookingRepositoryPort,
        @Inject(SHOWTIME_REPOSITORY_PORT)
        private readonly showtimeRepository: ShowtimeRepositoryPort,
    ) { }

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