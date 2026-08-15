import { Inject, Injectable } from "@nestjs/common";
import { MOVIE_REPOSITORY_PORT, type MovieRepositoryPort } from "src/movie/domain/ports";
@Injectable()
export class CreateMovieUseCase {
    constructor(
        @Inject(MOVIE_REPOSITORY_PORT)
        private readonly movieRepository: MovieRepositoryPort
    ) {
    }
    execute(
        movie: any
    ) {
        return this.movieRepository.create(
            movie
        );
    }
}