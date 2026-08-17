import { Inject, Injectable } from "@nestjs/common";
import { MOVIE_REPOSITORY_PORT, UpdateMovieData, type MovieRepositoryPort } from "src/movie/domain/ports";
import { UpdateMovieDto } from "../dtos";
import { MovieNotFoundException } from "src/movie/domain/exceptions";
/**
 * Caso de uso responsable de actualizar parcialmente los datos de una película existente.
 * Valida la existencia del recurso antes de persistir los cambios.
 */
@Injectable()
export class UpdateMovieUseCase {
    constructor(
        @Inject(MOVIE_REPOSITORY_PORT)
        private readonly movieRepository: MovieRepositoryPort,
    ) {
    }
    /**
   * Ejecuta la actualización parcial de una película en el catálogo.
   *
   * @param id - Identificador único de la película.
   * @param dto - Campos opcionales a modificar (título, sinopsis, duración, género, rating).
   * @returns La entidad `Movie` actualizada.
   * @throws {MovieNotFoundException} Si la película no existe en el repositorio.
   */
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