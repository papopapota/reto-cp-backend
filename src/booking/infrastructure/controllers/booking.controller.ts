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

    @HttpCode(HttpStatus.CREATED)
    @Post()
    createBooking(
        @Body() dto: CreateBookingDto
    ) {
        return this.createBookingUseCase.execute(dto);
    }
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    getBookingById(
        @Param('id', ParseUUIDPipe) id: string
    ) {
        return this.getBookingDetailsUseCase.execute(id);
    }
}
