import { Inject, Injectable } from "@nestjs/common";
import { MOVIE_REPOSITORY_PORT, type MovieRepositoryPort } from "src/movie/domain/ports";
import { CreateMovieDto } from "../dtos";
import { Movie } from "src/movie/domain/entities";
@Injectable()
export class CreateMovieUseCase {
    constructor(
        @Inject(MOVIE_REPOSITORY_PORT)
        private readonly movieRepository: MovieRepositoryPort
    ) {
    }
    execute(
        dto: CreateMovieDto
    ) {
        const movie = Movie.create({
            title: dto.title,
            synopsis: dto.synopsis,
            duration: dto.duration,
            genre: dto.genre,
            rating: dto.rating
        });
        return this.movieRepository.create(
            movie
        );
    }
}