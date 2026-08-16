import { Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';

@Controller('bookings')
export class BookingController {
    constructor() {

    }

    @Post()
    createBooking(

    ) {
        return 'Booking';
    }
    @Get()
    getBookingById(
        @Param('id', ParseUUIDPipe) id: string
    ) {
        return `boogiking id: ${id}`;
    }
}
