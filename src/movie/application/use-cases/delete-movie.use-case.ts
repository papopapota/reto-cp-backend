import { Inject, Injectable } from "@nestjs/common";
import { MOVIE_REPOSITORY_PORT, UpdateMovieData, type MovieRepositoryPort } from "src/movie/domain/ports";
import { UpdateMovieDto } from "../dtos";
import { MovieNotFoundException } from "src/movie/domain/exceptions";

@Injectable()
export class DeleteMovieUseCase {
    constructor(
        @Inject(MOVIE_REPOSITORY_PORT)
        private readonly movieRepository: MovieRepositoryPort,
    ) {
    }
    async execute(
        movieId: string
    ) {
        const movie = await this.movieRepository.findById(movieId);
        if (!movie) {
            throw new MovieNotFoundException();
        };
        await this.movieRepository.delete(movieId);
        return {
            message: `Pelicula con el ID ${movieId} eliminada correctamente`
        };
    }
}