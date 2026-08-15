import { Test } from "@nestjs/testing";
import { GetAllMoviesUseCase } from "src/movie/application/use-cases";
import { Movie } from "src/movie/domain/entities";
import { MOVIE_REPOSITORY_PORT, MovieRepositoryPort, PaginatedResult } from "src/movie/domain/ports";
import { MovieRepositoryMock } from "src/movie/mock";
import { MovieQueryStub } from "src/movie/stub";
import movieJson from "src/prisma/seeds/json/movies.json";

describe('GetAllMoviesUseCase', () => {
    let useCase: GetAllMoviesUseCase;
    let movieRepository: jest.Mocked<MovieRepositoryPort>;
    let findAllSpy: jest.SpyInstance;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: MOVIE_REPOSITORY_PORT,
                    useValue: new MovieRepositoryMock()
                },
                GetAllMoviesUseCase,
            ]
        }).compile();

        useCase = module.get<GetAllMoviesUseCase>(GetAllMoviesUseCase);
        movieRepository = jest.mocked(module.get(MOVIE_REPOSITORY_PORT));
        findAllSpy = jest.spyOn(movieRepository, 'findAll');
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
    }

    describe('when is called, then it should', () => {
        describe('with no movies in the repository', () => {
            let result: any;
            beforeEach(async () => {
                result = await useCase.execute(MovieQueryStub());
            });
            test('call the movie repository with the correct query', () => {
                expect(findAllSpy).toHaveBeenCalledWith(MovieQueryStub());
            });
            test('return the correct meta information', () => {
                expect(result.meta).toEqual({
                    total: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPrevPage: false
                });
            });
            test('return an empty array when no movies are found', () => {
                expect(result.data).toEqual([]);
            });
        });
        describe('with movies in the repository', () => {
            let result: PaginatedResult<Movie>;
            const query = MovieQueryStub();
            beforeEach(async () => {
                await addMoviesToRepository();
                result = await useCase.execute(query);
            });
            test('return the correct meta information', () => {
                const expectedTotalPages = Math.ceil(movieJson.length / query.limit);

                expect(result.meta).toEqual({
                    total: movieJson.length,
                    page: query.page,
                    limit: query.limit,
                    totalPages: expectedTotalPages,
                    hasNextPage: query.page < expectedTotalPages,
                    hasPrevPage: query.page > 1,
                });
            });

            test('return the items for the requested page slice', () => {
                const expectedLength = Math.min(query.limit, movieJson.length);
                expect(result.data).toHaveLength(expectedLength);
            });
        });
    });
});