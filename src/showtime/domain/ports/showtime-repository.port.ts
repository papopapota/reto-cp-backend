import { PaginatedResultPort } from "src/common/application/ports";
import { Showtime } from "../entities";
import { Movie } from "src/movie/domain/entities";

export interface ShowtimeFilterOptions {
    movieId?: string;
    date?: string;
    minPrice?: number;
    maxPrice?: number;
    page: number;
    limit: number;
}
export interface ShowtimeWithMovie {
    showtime: Showtime;
    movie: Movie;
}

export interface ShowtimeRepositoryPort {
    create(showtime: Showtime): Promise<Showtime>;
    findById(id: string): Promise<Showtime | null>;
    findAll(filters: ShowtimeFilterOptions): Promise<PaginatedResultPort<Showtime>>;
    findUpcomingByMovieId(movieId: string): Promise<Showtime[]>;
    findOverlappingShowtimes(
        room: string,
        startTime: Date,
        endTime: Date,
    ): Promise<ShowtimeWithMovie[]>;
    update(showtime: Showtime): Promise<void>;
    delete(id: string): Promise<void>;
}
export const SHOWTIME_REPOSITORY_PORT = Symbol('SHOWTIME_REPOSITORY_PORT');
