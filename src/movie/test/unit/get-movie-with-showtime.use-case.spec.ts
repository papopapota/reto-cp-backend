import { Test } from "@nestjs/testing";
import { GetAllMoviesUseCase, GetMovieWithShowtimeUseCase } from "src/movie/application/use-cases";
import { Movie } from "src/movie/domain/entities";
import { MovieNotFoundException } from "src/movie/domain/exceptions";
import { MOVIE_REPOSITORY_PORT, MovieRepositoryPort, PaginatedResult } from "src/movie/domain/ports";
import { MovieRepositoryMock } from "src/movie/mock";
import { MovieQueryStub } from "src/movie/stub";
import movieJson from "src/prisma/seeds/json/movies.json";
import { Showtime } from "src/showtime/domain/entities/showtime.entity";
import { SHOWTIME_REPOSITORY_PORT, ShowtimeRepositoryPort } from "src/showtime/domain/ports/showtime-repository.port";
import { ShowtimeRepositoryMock } from "src/showtime/mock";
import { roomArrayStub } from "src/showtime/stub";

describe('GetMovieWithShowtimeUseCase', () => {
    let useCase: GetMovieWithShowtimeUseCase;
    let movieRepository: jest.Mocked<MovieRepositoryPort>;
    let showtimeRepository: jest.Mocked<ShowtimeRepositoryPort>;
    let findShowtimeUpcomingByMovieIdSpy: jest.SpyInstance;
    let findMovieByIdSpy: jest.SpyInstance;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: MOVIE_REPOSITORY_PORT,
                    useValue: new MovieRepositoryMock()
                },
                {
                    provide: SHOWTIME_REPOSITORY_PORT,
                    useValue: new ShowtimeRepositoryMock()
                },
                GetMovieWithShowtimeUseCase,
            ]
        }).compile();

        useCase = module.get<GetMovieWithShowtimeUseCase>(GetMovieWithShowtimeUseCase);
        movieRepository = jest.mocked(module.get(MOVIE_REPOSITORY_PORT));
        showtimeRepository = jest.mocked(module.get(SHOWTIME_REPOSITORY_PORT));
        findMovieByIdSpy = jest.spyOn(movieRepository, 'findById');
        findShowtimeUpcomingByMovieIdSpy = jest.spyOn(showtimeRepository, 'findUpcomingByMovieId');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    async function addMoviesToRepository(movies = movieJson) {
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
                return movieRepository.create(movieEntity);
            }),
        );

        const allMoviesCreated = (await movieRepository.findAll(MovieQueryStub())).data;
        return allMoviesCreated;
    }

    async function addShowtimesToMovies(movies: Movie[]) {
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
                await showtimeRepository.create(showtime);
            }
        });

    }

    describe('when is called, then it should', () => {
        describe('with showtimes', () => {
            let result: any;
            let movieId: string;
            beforeEach(async () => {
                const movies = await addMoviesToRepository();
                await addShowtimesToMovies(movies);
                movieId = movies[0].getId()!;
                result = await useCase.execute(movieId);
            });
            test('call the movie repository with the correct query', () => {
                expect(findMovieByIdSpy).toHaveBeenCalledWith(movieId);
            });
            test('call the showtime repository with the correct query', () => {
                expect(findShowtimeUpcomingByMovieIdSpy).toHaveBeenCalledWith(movieId);
            });
            test('return the correct movie information', () => {
                expect(result).toHaveProperty('id', movieId);
                expect(result).toHaveProperty('title');
                expect(result).toHaveProperty('synopsis');
                expect(result).toHaveProperty('duration');
                expect(result).toHaveProperty('genre');
                expect(result).toHaveProperty('rating');
                expect(result).toHaveProperty('showtimes');
            });
            test('return an array of showtimes', () => {
                const showtimes = result.showtimes;
                expect(Array.isArray(showtimes)).toBe(true);
            });
            test('return the correct showtime information', () => {
                const showtimes = result.showtimes;
                showtimes.forEach((showtime: any) => {
                    expect(showtime).toHaveProperty('id');
                    expect(showtime).toHaveProperty('room');
                    expect(showtime).toHaveProperty('dateTime');
                    expect(showtime).toHaveProperty('price');
                    expect(showtime).toHaveProperty('availableSeats');
                });
            });
        });
        describe('with no showtimes in the repository', () => {
            let result: any;
            let movieId: string;
            beforeEach(async () => {
                const movies = await addMoviesToRepository();
                movieId = movies[0].getId()!;
                result = await useCase.execute(movieId);
            });
            test('return an empty array of showtimes', () => {
                const showtimes = result.showtimes;
                expect(Array.isArray(showtimes)).toBe(true);
                expect(showtimes.length).toBe(0);
            });
        });
        describe('with no movie in the repository', () => {
            let error: any;
            let movieId: string;
            beforeEach(async () => {
                movieId = 'non-existent-movie-id';
                try {
                    await useCase.execute(movieId);
                } catch (e) {
                    error = e;
                }
            });
            test('throw a MovieNotFoundException', () => {
                expect(error).toBeInstanceOf(MovieNotFoundException);
            });
        });
    });
});