import { Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';
import { QueryShowtimeDto } from 'src/showtime/application/dtos';
import { GetAllShowtimeUseCase } from 'src/showtime/application/use-cases';

@Controller('showtimes')
export class ShowtimeController {
    constructor(
        private readonly getAllShowtimeUseCase: GetAllShowtimeUseCase
    ) { }
    @HttpCode(HttpStatus.OK)
    @Get()
    getShowtimes(
        @Query() query: QueryShowtimeDto
    ) {
        return this.getAllShowtimeUseCase.execute(query);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    createShowtime() {
        return { message: 'Showtimes endpoint created' };
    }
}
