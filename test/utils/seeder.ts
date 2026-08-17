import { Movie } from "src/movie/domain/entities";
import { MovieRepositoryPort } from "src/movie/domain/ports";
import { MovieQueryStub } from "src/movie/stub/movie-query.stub";
import movieJson from "src/prisma/seeds/json/movies.json";
import { Showtime } from "src/showtime/domain/entities";
import { ShowtimeRepositoryPort } from "src/showtime/domain/ports";
import { roomArrayStub, ShowtimeFilterStub } from "src/showtime/stub";

export class Seeder {
    constructor(
        private readonly movieRepository: MovieRepositoryPort,
        private readonly showtimeRepository: ShowtimeRepositoryPort,
    ) { }
    async addMoviesToRepository(movies = movieJson) {
        await Promise.all(
            movies.map((props) => {
                const movieEntity = new Movie({
                    title: props.title,
                    synopsis: props.synopsis,
                    duration: props.duration,
                    genre: props.genre as any,
                    rating: props.rating as any,
                    deletedAt: null
                });
                return this.movieRepository.create(movieEntity);
            }),
        );

        const allMoviesCreated = (await this.movieRepository.findAll(MovieQueryStub())).data;
        return allMoviesCreated;
    }
    async addShowtimesToMovies(movies: Movie[]) {
        const ROOMS = roomArrayStub();
        const now = new Date();
        movies.forEach(async (movie, index) => {
            for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
                const roomConfig = ROOMS[(index + dayOffset) % ROOMS.length];
                const showtimeDate = new Date(now);
                showtimeDate.setDate(now.getDate() + dayOffset);
                const hour = 15 + dayOffset * 3;
                showtimeDate.setHours(hour, 30, 0, 0);
                const showtime = new Showtime({
                    movieId: movie.getId()!,
                    room: roomConfig.name,
                    dateTime: showtimeDate,
                    price: roomConfig.price,
                    totalSeats: roomConfig.capacity,
                    availableSeats: roomConfig.capacity,
                });
                await this.showtimeRepository.create(showtime)
            }
        });
        const allShowtimesCreated = await this.showtimeRepository.findAll(ShowtimeFilterStub());
        return allShowtimesCreated;
    }
}

