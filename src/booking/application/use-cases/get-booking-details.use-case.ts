import { Inject, Injectable } from '@nestjs/common';
import { BOOKING_REPOSITORY_PORT, type BookingRepositoryPort, BookingDetails } from 'src/booking/domain/ports';
import { BookingNotFoundException } from 'src/booking/domain/exceptions';

@Injectable()
export class GetBookingDetailsUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY_PORT)
    private readonly bookingRepository: BookingRepositoryPort,
  ) { }
  /**
     * Busca y retorna el detalle consolidado de una reserva.
     *
     * @param id - Identificador único de la reserva en formato UUID.
     * @returns Objeto estructurado con la entidad de reserva y los datos de la función y película vinculadas.
     *
     * @throws {BookingNotFoundException} Si no se encuentra un registro activo para el ID indicado.
     */
  async execute(id: string): Promise<BookingDetails> {
    const details = await this.bookingRepository.findByIdWithDetails(id);

    if (!details) {
      throw new BookingNotFoundException(`No se encontró la reserva con id: ${id}`);
    }

    return details;
  }
}