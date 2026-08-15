import { Inject, Injectable } from "@nestjs/common";
import { MOVIE_REPOSITORY_PORT, MovieQuery, type MovieRepositoryPort } from "src/movie/domain/ports";
@Injectable()
export class GetAllMoviesUseCase {
    constructor(
        @Inject(MOVIE_REPOSITORY_PORT)
        private readonly movieRepository: MovieRepositoryPort
    ) {
    }
    execute(
        query: MovieQuery
    ) {
        return this.movieRepository.findAll(query);
    }
}