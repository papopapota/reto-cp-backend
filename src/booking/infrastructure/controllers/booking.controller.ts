import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { CreateBookingDto } from 'src/booking/application/dtos';
import { CreateBookingUseCase, GetBookingDetailsUseCase } from 'src/booking/application/use-cases';

@Controller('bookings')
export class BookingController {
    constructor(
        private readonly createBookingUseCase: CreateBookingUseCase,
        private readonly getBookingDetailsUseCase: GetBookingDetailsUseCase
    ) {
    }
    /**
       * Registra y confirma una nueva reserva de asientos para una función determinada.
       *
       * @param createBookingDto - Payload con los datos de la reserva (ID de función, cliente y asientos).
       * @returns La entidad de la reserva generada con su identificador y precio total calculado.
       */
    @HttpCode(HttpStatus.CREATED)
    @Post()
    createBooking(
        @Body() dto: CreateBookingDto
    ) {
        return this.createBookingUseCase.execute(dto);
    }

    /**
   * Consulta la información detallada de una reserva existente, enriquecida con datos de la función y película.
   *
   * @param id - Identificador único de la reserva en formato UUID v4.
   * @returns Objeto con el detalle completo de la reserva, función asociada y película.
   */
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    getBookingById(
        @Param('id', ParseUUIDPipe) id: string
    ) {
        return this.getBookingDetailsUseCase.execute(id);
    }
}
