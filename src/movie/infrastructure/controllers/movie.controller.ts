import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';
import { CreateMovieDto, GetMoviesQueryDto } from 'src/movie/application/dtos';
import { GetAllMoviesUseCase } from 'src/movie/application/use-cases';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly getMoviesUseCase: GetAllMoviesUseCase,
    ) { }
    @Get()
    getMovies(
        @Query() query: GetMoviesQueryDto
    ) {
        return this.getMoviesUseCase.execute({
            page: query.page ?? 1,
            limit: query.limit ?? 10,
            genre: query.genre,
            rating: query.rating,
            sortBy: query.sortBy ?? 'createdAt',
            sortOrder: query.sortOrder ?? 'desc',
        });
    }

    @Get(':id')
    getMovieById() {
        return "getMovieById";
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createMovie(
        @Body() dto: CreateMovieDto
    ) {
        return `movie created with title: ${dto.title}, synopsis: ${dto.synopsis}, duration: ${dto.duration}, genre: ${dto.genre}, rating: ${dto.rating}`;
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
