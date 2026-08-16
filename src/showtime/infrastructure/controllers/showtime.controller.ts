import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';

@Controller('showtimes')
export class ShowtimeController {
    @HttpCode(HttpStatus.OK)
    @Get()
    getShowtimes() {
        return { message: 'Showtimes endpoint get all' };
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    createShowtime() {
        return { message: 'Showtimes endpoint created' };
    }
}
