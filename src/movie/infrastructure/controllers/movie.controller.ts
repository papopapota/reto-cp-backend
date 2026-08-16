import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';
import { CreateMovieDto, GetMoviesQueryDto, UpdateMovieDto } from 'src/movie/application/dtos';
import { CreateMovieUseCase, GetAllMoviesUseCase, GetMovieWithShowtimeUseCase, UpdateMovieUseCase } from 'src/movie/application/use-cases';

@Controller('movies')
export class MovieController {
    constructor(
        private readonly getMoviesUseCase: GetAllMoviesUseCase,
        private readonly getMovieWithShowtimeUseCase: GetMovieWithShowtimeUseCase,
        private readonly createMovieUseCase: CreateMovieUseCase,
        private readonly updateMovieUseCase: UpdateMovieUseCase
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
    getMovieById(
        @Param('id') id: string
    ) {
        return this.getMovieWithShowtimeUseCase.execute(id);
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
    updateMovie(
        @Param('id') id: string,
        @Body() dto: UpdateMovieDto
    ) {
        return this.updateMovieUseCase.execute(id, dto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteMovie() {
        return "deleteMovie";
    }
}
