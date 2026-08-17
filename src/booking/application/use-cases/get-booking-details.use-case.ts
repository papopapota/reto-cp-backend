import { Inject, Injectable } from '@nestjs/common';
import { BOOKING_REPOSITORY_PORT, type BookingRepositoryPort, BookingDetails } from 'src/booking/domain/ports';
import { BookingNotFoundException } from 'src/booking/domain/exceptions';

@Injectable()
export class GetBookingDetailsUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY_PORT)
    private readonly bookingRepository: BookingRepositoryPort,
  ) {}

  async execute(id: string): Promise<BookingDetails> {
    const details = await this.bookingRepository.findByIdWithDetails(id);

    if (!details) {
      throw new BookingNotFoundException(`No se encontró la reserva con id: ${id}`);
    }

    return details;
  }
}