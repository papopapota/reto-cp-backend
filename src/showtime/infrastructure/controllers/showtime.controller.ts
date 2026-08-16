import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';
import { GetAllShowtimeUseCase } from 'src/showtime/application/use-cases';

@Controller('showtimes')
export class ShowtimeController {
    constructor(
        private readonly getAllShowtimeUseCase: GetAllShowtimeUseCase
    ) { }
    @HttpCode(HttpStatus.OK)
    @Get()
    getShowtimes() {
        return this.getAllShowtimeUseCase.execute();
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    createShowtime() {
        return { message: 'Showtimes endpoint created' };
    }
}
