import { Inject, Injectable } from "@nestjs/common";
import { MOVIE_REPOSITORY_PORT, UpdateMovieData, type MovieRepositoryPort } from "src/movie/domain/ports";
import { MovieNotFoundException } from "src/movie/domain/exceptions";

@Injectable()
export class DeleteMovieUseCase {
    constructor(
        @Inject(MOVIE_REPOSITORY_PORT)
        private readonly movieRepository: MovieRepositoryPort,
    ) {
    }
      /**
     * Ejecuta la eliminación lógica (soft delete) de una película.
     *
     * @param id - Identificador único de la película.
     * @returns mensaje de confirmación de eliminación.
     * @throws {MovieNotFoundException} Si la película no existe en el repositorio.
     */
    async execute(
        movieId: string
    ) {
        const movie = await this.movieRepository.findById(movieId);
        if (!movie) {
            throw new MovieNotFoundException();
        };
        movie.setDeletedAt();
        await this.movieRepository.delete(movieId);
        return {
            message: `Pelicula con el ID ${movieId} eliminada correctamente`
        };
    }
}