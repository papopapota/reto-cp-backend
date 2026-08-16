import { Test } from "@nestjs/testing";
import { MovieRepositoryMock } from "src/movie/mock";
import { GetAllShowtimeUseCase } from "src/showtime/application/use-cases";
import { SHOWTIME_REPOSITORY_PORT, ShowtimeRepositoryPort } from "src/showtime/domain/ports";
import { ShowtimeRepositoryMock } from "src/showtime/mock";
import { ShowtimeFilterStub } from "src/showtime/stub";
import { Seeder } from "test/utils/seeder";

describe('GetAllShowtimeUseCase', () => {
    let useCase: GetAllShowtimeUseCase;
    let showtimeRepository: jest.Mocked<ShowtimeRepositoryPort>;
    let findAllSpy: jest.SpyInstance;
    let seeder: Seeder;
    beforeAll(async () => { });
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: SHOWTIME_REPOSITORY_PORT,
                    useValue: new ShowtimeRepositoryMock()
                },
                GetAllShowtimeUseCase,
            ]
        }).compile();

        useCase = module.get<GetAllShowtimeUseCase>(GetAllShowtimeUseCase);
        showtimeRepository = jest.mocked(module.get(SHOWTIME_REPOSITORY_PORT));
        findAllSpy = jest.spyOn(showtimeRepository, 'findAll');
        seeder = new Seeder(
            new MovieRepositoryMock(),
            showtimeRepository
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when is called, then it should', () => {
        describe('with showtimes', () => {
            let result: any;
            beforeEach(async () => {
                const movies = await seeder.addMoviesToRepository();
                const showtimes = await seeder.addShowtimesToMovies(movies);
                result = await useCase.execute(ShowtimeFilterStub());
            });
            test('call the movie repository with the correct query', () => {
                expect(findAllSpy).toHaveBeenCalledWith(ShowtimeFilterStub());
            });
            test('return an array of showtimes', () => {
                const showtimes = result.data;
                expect(Array.isArray(showtimes)).toBe(true);
            });
            test('return the correct meta information', () => {
                expect(result.meta).toHaveProperty('total');
                expect(result.meta).toHaveProperty('page');
                expect(result.meta).toHaveProperty('limit');
                expect(result.meta).toHaveProperty('totalPages');
                expect(result.meta).toHaveProperty('hasNextPage');
                expect(result.meta).toHaveProperty('hasPrevPage');
            });
            test('showtimes should have the correct properties', () => {
                const showtimes = result.data;
                showtimes.forEach((showtime: any) => {
                    expect(showtime).toHaveProperty('id');
                    expect(showtime).toHaveProperty('movieId');
                    expect(showtime).toHaveProperty('room');
                    expect(showtime).toHaveProperty('dateTime');
                    expect(showtime).toHaveProperty('price');
                    expect(showtime).toHaveProperty('totalSeats');
                    expect(showtime).toHaveProperty('availableSeats');
                    expect(showtime).toHaveProperty('createdAt');
                    expect(showtime).toHaveProperty('updatedAt');
                    expect(showtime).toHaveProperty('deletedAt');
                });
            });
        });
        describe('with filtered showtimes', () => {
            let result: any;
            beforeEach(async () => {
                const movies = await seeder.addMoviesToRepository();
                const showtimes = await seeder.addShowtimesToMovies(movies);
                const movieId = movies[0].getId()!;
                result = await useCase.execute(ShowtimeFilterStub(movieId));
            });
            test('showtimes should have the correct movieId', () => {
                const showtimes = result.data;
                const movieId = showtimes[0].movieId;
                showtimes.forEach((showtime: any) => {
                    expect(showtime.movieId).toBe(movieId);
                });
            });
        });
        describe('with no showtimes in the repository', () => {
            let result: any;
            beforeEach(async () => {
                result = await useCase.execute(ShowtimeFilterStub());
            });
            test('return an empty array of showtimes', () => {
                const showtimes = result.data;
                expect(Array.isArray(showtimes)).toBe(true);
                expect(showtimes.length).toBe(0);
            });
        });
    });
});