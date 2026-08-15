import { CreateMovieDto } from "../application/dtos";

export const CreateMovieDtoStub = (): CreateMovieDto => ({
    title: 'The Matrix',
    synopsis: 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
    duration: 136,
    genre: 'ACTION' as any,
    rating: 'PG' as any
});