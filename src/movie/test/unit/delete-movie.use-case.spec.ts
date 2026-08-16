import { Test } from "@nestjs/testing";
import { DeleteMovieUseCase } from "src/movie/application/use-cases";
import { Movie } from "src/movie/domain/entities";
import { MovieNotFoundException } from "src/movie/domain/exceptions/movie-not-found.exception";
import { MOVIE_REPOSITORY_PORT, MovieRepositoryPort } from "src/movie/domain/ports";
import { MovieRepositoryMock } from "src/movie/mock";
import { CreateMovieDtoStub, updateMovieDtoStub } from "src/movie/stub";

describe('DeleteMovieUseCase', () => {
    let useCase: DeleteMovieUseCase;
    let movieRepository: jest.Mocked<MovieRepositoryPort>;
    let deleteMovieSpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: MOVIE_REPOSITORY_PORT,
                    useValue: new MovieRepositoryMock()
                },
                DeleteMovieUseCase,
            ]
        }).compile();

        useCase = module.get<DeleteMovieUseCase>(DeleteMovieUseCase);
        movieRepository = jest.mocked(module.get(MOVIE_REPOSITORY_PORT));
        deleteMovieSpy = jest.spyOn(movieRepository, 'delete');
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
                result = await useCase.execute(movieId);
            });
            test('call the movie repository with the correct params', () => {
                expect(findByIdSpy).toHaveBeenCalledWith(movieId);
            });
            test('call the movie repository with the correct params', () => {
                expect(deleteMovieSpy).toHaveBeenCalledWith(movieId);
            });
            test('return the correct message', () => {
                expect(result.message).toEqual(`Pelicula con el ID ${movieId} eliminada correctamente`);
            });
            test('not find the movie after deletion', async () => {
                const deletedMovie = await movieRepository.findById(movieId);
                expect(deletedMovie).toBe(null);
            });
        });

        describe('with no movie in the repository', () => {
            let result: any;
            let error: any;
            beforeEach(async () => {
                try {
                    result = await useCase.execute('non-existent-id');
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