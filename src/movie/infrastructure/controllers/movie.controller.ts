import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';

@Controller('movies')
export class MovieController {
    @Get()
    getMovies() {
        return "getMovies";
    }
    
    @Get(':id')
    getMovieById() {
        return "getMovieById";
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createMovie() {
        return "createMovie";
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateMovie() {
        return "updateMovie";
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteMovie() {
        return "deleteMovie";
    }
}
