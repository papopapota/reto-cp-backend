import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';
import { CreateShowtimeDto, QueryShowtimeDto } from 'src/showtime/application/dtos';
import { CreateShowtimeUseCase, GetAllShowtimeUseCase } from 'src/showtime/application/use-cases';

@Controller('showtimes')
export class ShowtimeController {
    constructor(
        private readonly createShowtimeUseCase: CreateShowtimeUseCase,
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
    createShowtime(
        @Body() dto: CreateShowtimeDto
    ) {
        return this.createShowtimeUseCase.execute(dto);
    }
}
