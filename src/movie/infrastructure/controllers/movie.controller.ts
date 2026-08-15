import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';
import { CreateMovieDto, GetMoviesQueryDto } from 'src/movie/application/dtos';
import { CreateMovieUseCase, GetAllMoviesUseCase } from 'src/movie/application/use-cases';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly getMoviesUseCase: GetAllMoviesUseCase,
        private readonly createMovieUseCase: CreateMovieUseCase
    ) { }

    @HttpCode(HttpStatus.OK)
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

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    getMovieById() {
        return "getMovieById";
    }

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @Post()
    createMovie(
        @Body() dto: CreateMovieDto
    ) {
        return this.createMovieUseCase.execute(dto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateMovie() {
        return "updateMovie";
    }
    
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteMovie() {
        return "deleteMovie";
    }
}
