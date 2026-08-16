import { Showtime } from "../domain/entities";
import { ShowtimeRepositoryPort } from "../domain/ports";

export class ShowtimeRepositoryMock implements ShowtimeRepositoryPort {
    private showtimes: Showtime[] = [];

    create(showtime: Showtime): Promise<void> {
        this.showtimes.push(showtime);
        return Promise.resolve();
    }
    findById(id: string): Promise<Showtime | null> {
        const showtime = this.showtimes.find((st) => st.getId() === id);
        return Promise.resolve(showtime ?? null);
    }
    findAll(): Promise<Showtime[]> {
        return Promise.resolve(this.showtimes);
    }
    findUpcomingByMovieId(movieId: string): Promise<Showtime[]> {
        const now = new Date();
        const upcomingShowtimes = this.showtimes.filter((st) => st.getMovieId() === movieId && st.getDateTime() > now);
        return Promise.resolve(upcomingShowtimes);
    }
    update(showtime: Showtime): Promise<void> {
        const index = this.showtimes.findIndex((st) => st.getId() === showtime.getId());
        if (index !== -1) {
            this.showtimes[index] = showtime;
        }
        return Promise.resolve();
    }
    delete(id: string): Promise<void> {
        this.showtimes = this.showtimes.filter((st) => st.getId() !== id);
        return Promise.resolve();
    }

}