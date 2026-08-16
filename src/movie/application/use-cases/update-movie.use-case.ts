import { Inject, Injectable } from "@nestjs/common";
import { MOVIE_REPOSITORY_PORT, UpdateMovieData, type MovieRepositoryPort } from "src/movie/domain/ports";
import { UpdateMovieDto } from "../dtos";
import { MovieNotFoundException } from "src/movie/domain/exceptions";

@Injectable()
export class UpdateMovieUseCase {
    constructor(
        @Inject(MOVIE_REPOSITORY_PORT)
        private readonly movieRepository: MovieRepositoryPort,
    ) {
    }
    async execute(
        movieId: string,
        dto: UpdateMovieDto
    ) {
        const movie = await this.movieRepository.findById(movieId);
        if (!movie) {
            throw new MovieNotFoundException();
        };
        const updateData: UpdateMovieData = {
            title: dto.title,
            synopsis: dto.synopsis,
            duration: dto.duration,
            genre: dto.genre,
            rating: dto.rating,
        };
        const updatedMovie = await this.movieRepository.update(movieId, updateData);
        return updatedMovie;
    }
}