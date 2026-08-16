import { Showtime } from "../entities";

export interface ShowtimeRepositoryPort {
    create(showtime: Showtime): Promise<void>;
    findById(id: string): Promise<Showtime | null>;
    findAll(): Promise<Showtime[]>;
    findUpcomingByMovieId(movieId: string): Promise<Showtime[]>;
    update(showtime: Showtime): Promise<void>;
    delete(id: string): Promise<void>;
}
export const SHOWTIME_REPOSITORY_PORT = Symbol('SHOWTIME_REPOSITORY_PORT');
