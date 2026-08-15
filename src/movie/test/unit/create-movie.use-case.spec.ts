import { Test } from "@nestjs/testing";
import { CreateMovieUseCase } from "src/movie/application/use-cases";
import { Movie } from "src/movie/domain/entities";
import { MOVIE_REPOSITORY_PORT, MovieRepositoryPort } from "src/movie/domain/ports";
import { MovieRepositoryMock } from "src/movie/mock";
import { CreateMovieDtoStub } from "src/movie/stub";

describe('CreateMovieUseCase', () => {
    let useCase: CreateMovieUseCase;
    let movieRepository: jest.Mocked<MovieRepositoryPort>;
    let createSpy: jest.SpyInstance;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: MOVIE_REPOSITORY_PORT,
                    useValue: new MovieRepositoryMock()
                },
                CreateMovieUseCase,
            ]
        }).compile();

        useCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
        movieRepository = jest.mocked(module.get(MOVIE_REPOSITORY_PORT));
        createSpy = jest.spyOn(movieRepository, 'create');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when is called, then it should', () => {
        let result: any;
        const movieEntity = new Movie({
            title: CreateMovieDtoStub().title,
            synopsis: CreateMovieDtoStub().synopsis,
            duration: CreateMovieDtoStub().duration,
            genre: CreateMovieDtoStub().genre,
            rating: CreateMovieDtoStub().rating,
            deletedAt: null
        });
        beforeEach(async () => {
            result = await useCase.execute(CreateMovieDtoStub());
        });
        test('call the movie repository', () => {
            expect(createSpy).toHaveBeenCalled();
        });
        test('call the movie repository with the correct movie entity', () => {
            expect(createSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: movieEntity.getTitle(),
                    synopsis: movieEntity.getSynopsis(),
                    duration: movieEntity.getDuration(),
                    genre: movieEntity.getGenre(),
                    rating: movieEntity.getRating(),
                })
            );
        });
        test('return the correct movie entity', () => {
            expect(result).toEqual(
                expect.objectContaining({
                    title: movieEntity.getTitle(),
                    synopsis: movieEntity.getSynopsis(),
                    duration: movieEntity.getDuration(),
                    genre: movieEntity.getGenre(),
                    rating: movieEntity.getRating(),
                })
            );
        });
    });
});