import { Inject, Injectable } from "@nestjs/common";
import { MOVIE_REPOSITORY_PORT, type MovieRepositoryPort } from "src/movie/domain/ports";
import { MovieWithShowtimesResponse } from "../dtos";
import { SHOWTIME_REPOSITORY_PORT, type ShowtimeRepositoryPort } from "src/showtime/domain/ports";
import { MovieNotFoundException } from "src/movie/domain/exceptions";

@Injectable()
export class GetMovieWithShowtimeUseCase {
    constructor(
        @Inject(MOVIE_REPOSITORY_PORT)
        private readonly movieRepository: MovieRepositoryPort,
        @Inject(SHOWTIME_REPOSITORY_PORT)
        private readonly showtimeRepository: ShowtimeRepositoryPort,
    ) {
    }

    /**
     * Ejecuta la obtención de una película junto con sus próximos horarios de proyección.
     *
     * @param id - Identificador único de la película.
     * @returns La entidad `Movie` actualizada.
     * @throws {MovieNotFoundException} Si la película no existe en el repositorio.
     */
    async execute(
        movieId: string
    ): Promise<MovieWithShowtimesResponse> {
        const [movie, showtimes] = await Promise.all([
            this.movieRepository.findById(movieId),
            this.showtimeRepository.findUpcomingByMovieId(movieId)
        ]);
        if (!movie) {
            throw new MovieNotFoundException();
        };
        return {
            id: movie.getId()!,
            title: movie.getTitle(),
            synopsis: movie.getSynopsis(),
            duration: movie.getDuration(),
            genre: movie.getGenre(),
            rating: movie.getRating(),
            showtimes: showtimes.map((st) => ({
                id: st.getId()!,
                room: st.getRoom(),
                dateTime: st.getDateTime(),
                price: st.getPrice(),
                availableSeats: st.getAvailableSeats(),
            })),
        };
    }
}