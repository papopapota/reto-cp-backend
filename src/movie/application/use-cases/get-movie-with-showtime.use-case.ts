import { Inject, Injectable } from "@nestjs/common";
import { MOVIE_REPOSITORY_PORT, type MovieRepositoryPort } from "src/movie/domain/ports";
import { MovieWithShowtimesResponse } from "../dtos";
import { DomainException } from "src/common/domain/exceptions/domain.exception";
import { SHOWTIME_REPOSITORY_PORT, type ShowtimeRepositoryPort } from "src/showtime/domain/ports";

@Injectable()
export class GetMovieWithShowtimeUseCase {
    constructor(
        @Inject(MOVIE_REPOSITORY_PORT)
        private readonly movieRepository: MovieRepositoryPort,
        @Inject(SHOWTIME_REPOSITORY_PORT)
        private readonly showtimeRepository: ShowtimeRepositoryPort,
    ) {
    }
    async execute(
        movieId: string
    ): Promise<MovieWithShowtimesResponse> {
        const [movie, showtimes] = await Promise.all([
            this.movieRepository.findById(movieId),
            this.showtimeRepository.findUpcomingByMovieId(movieId)
        ]);
        if (!movie) {
            throw new DomainException('Movie not found', 'MOVIE_NOT_FOUND', 404);
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