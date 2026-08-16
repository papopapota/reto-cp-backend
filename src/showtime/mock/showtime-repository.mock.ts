import { PaginatedResultPort } from "src/common/application/ports";
import { Showtime } from "../domain/entities";
import { ShowtimeFilterOptions, ShowtimeRepositoryPort, ShowtimeWithMovie } from "../domain/ports";
import { Movie } from "src/movie/domain/entities";
import { MovieGenreEnum, MovieRatingEnum } from "src/movie/domain/enums";

export class ShowtimeRepositoryMock implements ShowtimeRepositoryPort {
    private showtimes: Showtime[] = [];

    findOverlappingShowtimes(room: string, startTime: Date, endTime: Date): Promise<ShowtimeWithMovie[]> {
        const overlappingShowtimes = this.showtimes.filter((st) => {
            return st.getRoom() === room && st.getDateTime() < endTime && new Date(st.getDateTime().getTime() + (st.getTotalSeats() * 60 * 1000)) > startTime;
        });
        const result: ShowtimeWithMovie[] = overlappingShowtimes.map((st) => ({
            showtime: st,
            movie: new Movie({
                id: st.getMovieId(),
                title: "Mock Movie Title",
                synopsis: "Mock Movie Synopsis",
                duration: 120,
                genre: MovieGenreEnum.ACTION,
                rating: MovieRatingEnum.PG_13,
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        }));
        return Promise.resolve(result);
    }
    async create(showtime: Showtime): Promise<Showtime> {
        this.showtimes.push(showtime);
        return Promise.resolve(showtime);
    }
    findById(id: string): Promise<Showtime | null> {
        const showtime = this.showtimes.find((st) => st.getId() === id);
        return Promise.resolve(showtime ?? null);
    }
    findAll(filters: ShowtimeFilterOptions): Promise<PaginatedResultPort<Showtime>> {
        // Apply filters to the showtimes array
        let filteredShowtimes = this.showtimes;
        if (filters.movieId) {
            filteredShowtimes = filteredShowtimes.filter((st) => st.getMovieId() === filters.movieId);
        }
        if (filters.date) {
            const filterDate = new Date(filters.date);
            filteredShowtimes = filteredShowtimes.filter((st) => st.getDateTime().toDateString() === filterDate.toDateString());
        }
        if (filters.minPrice !== undefined) {
            filteredShowtimes = filteredShowtimes.filter((st) => st.getPrice() >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
            filteredShowtimes = filteredShowtimes.filter((st) => st.getPrice() <= filters.maxPrice!);
        }

        // Pagination logic
        const total = filteredShowtimes.length;
        const startIndex = (filters.page - 1) * filters.limit;
        const endIndex = startIndex + filters.limit;
        const paginatedData = filteredShowtimes.slice(startIndex, endIndex);

        return Promise.resolve({
            data: paginatedData,
            meta: {
                total,
                page: filters.page,
                limit: filters.limit,
                totalPages: Math.ceil(total / filters.limit),
                hasNextPage: endIndex < total,
                hasPrevPage: startIndex > 0,
            },
        });
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