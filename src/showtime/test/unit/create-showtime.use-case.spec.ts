import { Test } from "@nestjs/testing";
import { MovieNotFoundException } from "src/movie/domain/exceptions";
import { MOVIE_REPOSITORY_PORT } from "src/movie/domain/ports";
import { MovieRepositoryMock } from "src/movie/mock";
import { CreateShowtimeUseCase } from "src/showtime/application/use-cases";
import { ShowtimeOverlapException } from "src/showtime/domain/exceptions/showtime-overlap.exception";
import { ShowtimePastDateException } from "src/showtime/domain/exceptions/showtime-past-date.exception";
import { SHOWTIME_REPOSITORY_PORT, ShowtimeRepositoryPort } from "src/showtime/domain/ports";
import { ShowtimeRepositoryMock } from "src/showtime/mock";
import { CreateShowtimeDtoStub } from "src/showtime/stub/create-showtime.dto.stub";
import { Seeder } from "test/utils/seeder";
const CLEANING_BUFFER_MINUTES = 15;
describe('CreateShowtimeUseCase', () => {
    let useCase: CreateShowtimeUseCase;
    let showtimeRepository: jest.Mocked<ShowtimeRepositoryPort>;
    let movieRepository: jest.Mocked<MovieRepositoryMock>;
    let findOverlappingShowtimesSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let movieFindByIdSpy: jest.SpyInstance;
    let seeder: Seeder;
    beforeAll(async () => { });
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: SHOWTIME_REPOSITORY_PORT,
                    useValue: new ShowtimeRepositoryMock()
                },
                {
                    provide: MOVIE_REPOSITORY_PORT,
                    useValue: new MovieRepositoryMock()
                },
                CreateShowtimeUseCase,
            ]
        }).compile();

        useCase = module.get<CreateShowtimeUseCase>(CreateShowtimeUseCase);
        showtimeRepository = jest.mocked(module.get(SHOWTIME_REPOSITORY_PORT));
        movieRepository = jest.mocked(module.get(MOVIE_REPOSITORY_PORT));
        findOverlappingShowtimesSpy = jest.spyOn(showtimeRepository, 'findOverlappingShowtimes');
        createSpy = jest.spyOn(showtimeRepository, 'create');
        movieFindByIdSpy = jest.spyOn(movieRepository, 'findById');
        seeder = new Seeder(
            movieRepository,
            showtimeRepository
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when is called, then it should', () => {
        describe('with valid data', () => {
            let result: any;
            let movieId: string;
            let dto: any;
            let movieDuration: number;
            let startTime: Date;
            let endTime: Date;
            beforeEach(async () => {
                const movies = await seeder.addMoviesToRepository();
                movieId = movies[0].getId()!;
                movieDuration = movies[0].getDuration();
                dto = CreateShowtimeDtoStub(movieId);
                startTime = new Date(dto.dateTime);
                endTime = new Date(startTime.getTime() + (movieDuration + CLEANING_BUFFER_MINUTES) * 60 * 1000);
                result = await useCase.execute(dto);
            });
            test('call the movie repository findById with the correct movie ID', () => {
                expect(movieFindByIdSpy).toHaveBeenCalledWith(movieId);
            });
            test('call the showtime repository findOverlappingShowtimes with the correct parameters', () => {
                expect(findOverlappingShowtimesSpy).toHaveBeenCalledWith(
                    dto.room,
                    startTime,
                    endTime
                );
            });
            test('call the showtime repository create with the correct parameters', () => {
                expect(createSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        movieId: dto.movieId,
                        room: dto.room,
                        dateTime: startTime,
                        price: dto.price,
                        totalSeats: dto.totalSeats,
                        availableSeats: dto.totalSeats,
                    })
                );
            });
            test('return the created showtime with the correct properties', () => {
                expect(result).toHaveProperty('id');
                expect(result).toHaveProperty('movieId', dto.movieId);
                expect(result).toHaveProperty('room', dto.room);
                expect(result).toHaveProperty('dateTime');
                expect(new Date(result.dateTime)).toEqual(startTime);
                expect(result).toHaveProperty('price', dto.price);
                expect(result).toHaveProperty('totalSeats', dto.totalSeats);
                expect(result).toHaveProperty('availableSeats', dto.totalSeats);
                expect(result).toHaveProperty('createdAt');
                expect(result).toHaveProperty('updatedAt');
                expect(result).toHaveProperty('deletedAt', null);
            });
        });
        describe('with a non-existing movie ID', () => {
            let dto: any;
            let error: any;
            beforeEach(async () => {
                try {
                    dto = CreateShowtimeDtoStub('non-existing-movie-id');
                    await useCase.execute(dto)
                } catch (err) {
                    error = err;
                }
            });
            test('throw a MovieNotFoundException', async () => {
                await expect(error).toBeInstanceOf(MovieNotFoundException);
            });
        });
        describe('with a past date', () => {
            let dto: any;
            let error: any;
            beforeEach(async () => {
                try {
                    const movies = await seeder.addMoviesToRepository();
                    const movieId = movies[0].getId()!;
                    dto = CreateShowtimeDtoStub(movieId);
                    dto.dateTime = new Date(new Date().getTime() - 3600000).toISOString(); // 1 hour in the past
                    await useCase.execute(dto);
                } catch (err) {
                    error = err;
                }
            });
            test('throw a ShowtimePastDateException', async () => {
                await expect(error).toBeInstanceOf(ShowtimePastDateException);
            });
        });
        describe('with an overlapping showtime', () => {
            let dto: any;
            let error: any;
            beforeEach(async () => {
                try {
                    const movies = await seeder.addMoviesToRepository();
                    const movieId = movies[0].getId()!;
                    dto = CreateShowtimeDtoStub(movieId);
                    await useCase.execute(dto);
                    await useCase.execute(dto);
                } catch (err) {
                    error = err;
                }
            });
            test('throw a ShowtimeOverlapException', async () => {
                await expect(error).toBeInstanceOf(ShowtimeOverlapException);
            });
        })
    });
});