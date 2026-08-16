import { Test } from "@nestjs/testing";
import { UpdateMovieUseCase } from "src/movie/application/use-cases";
import { Movie } from "src/movie/domain/entities";
import { MovieNotFoundException } from "src/movie/domain/exceptions/movie-not-found.exception";
import { MOVIE_REPOSITORY_PORT, MovieRepositoryPort } from "src/movie/domain/ports";
import { MovieRepositoryMock } from "src/movie/mock";
import { CreateMovieDtoStub, updateMovieDtoStub } from "src/movie/stub";

describe('UpdateMovieUseCase', () => {
    let useCase: UpdateMovieUseCase;
    let movieRepository: jest.Mocked<MovieRepositoryPort>;
    let updateMovieSpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: MOVIE_REPOSITORY_PORT,
                    useValue: new MovieRepositoryMock()
                },
                UpdateMovieUseCase,
            ]
        }).compile();

        useCase = module.get<UpdateMovieUseCase>(UpdateMovieUseCase);
        movieRepository = jest.mocked(module.get(MOVIE_REPOSITORY_PORT));
        updateMovieSpy = jest.spyOn(movieRepository, 'update');
        findByIdSpy = jest.spyOn(movieRepository, 'findById');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    function createMovie() {
        const movie = new Movie({
            title: CreateMovieDtoStub().title,
            synopsis: CreateMovieDtoStub().synopsis,
            duration: CreateMovieDtoStub().duration,
            genre: CreateMovieDtoStub().genre as any,
            rating: CreateMovieDtoStub().rating as any,
            deletedAt: null
        });
        return movieRepository.create(movie);
    }

    describe('when is called, then it should', () => {
        describe('with a movie in the repository', () => {
            let result: any;
            let movieId: string;
            beforeEach(async () => {
                const createdMovie = await createMovie();
                movieId = createdMovie.getId()!;
                result = await useCase.execute(movieId, updateMovieDtoStub());
            });
            test('call the movie repository with the correct params', () => {
                expect(findByIdSpy).toHaveBeenCalledWith(movieId);
            });
            test('call the movie repository with the correct params', () => {
                expect(updateMovieSpy).toHaveBeenCalledWith(movieId, {
                    title: updateMovieDtoStub().title,
                    synopsis: updateMovieDtoStub().synopsis,
                    duration: updateMovieDtoStub().duration,
                    genre: updateMovieDtoStub().genre,
                    rating: updateMovieDtoStub().rating,
                });
            });
            test('return the updated movie', () => {
                expect(result.title).toEqual(updateMovieDtoStub().title);
                expect(result.synopsis).toEqual(updateMovieDtoStub().synopsis);
                expect(result.duration).toEqual(updateMovieDtoStub().duration);
                expect(result.genre).toEqual(updateMovieDtoStub().genre);
                expect(result.rating).toEqual(updateMovieDtoStub().rating);
            });
        });

        describe('with no movie in the repository', () => {
            let result: any;
            let error: any;
            beforeEach(async () => {
                try {
                    result = await useCase.execute('non-existent-id', updateMovieDtoStub());
                } catch (err) {
                    error = err;
                }
            });
            test('throw a MovieNotFoundException', async () => {
                expect(error).toBeInstanceOf(MovieNotFoundException);
            });
        });
    });
});