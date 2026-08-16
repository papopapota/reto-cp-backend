import { Movie, MovieProps } from "src/movie/domain/entities";
import { MovieGenreEnum, MovieRatingEnum } from "../enums";

export interface MovieQuery {
  page: number;
  limit: number;
  genre?: MovieGenreEnum;
  rating?: MovieRatingEnum;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
export type UpdateMovieData = Partial<
  Pick<MovieProps, "title" | "synopsis" | "duration" | "genre" | "rating">
>;

export interface MovieRepositoryPort {
  create(movie: Movie): Promise<Movie>;
  update(id: string, updateMovieData: UpdateMovieData): Promise<Movie>;
  findAll(query: MovieQuery): Promise<PaginatedResult<Movie>>;
  findById(id: string): Promise<Movie | null>;
  delete(id: string): Promise<void>;
}

export const MOVIE_REPOSITORY_PORT = Symbol('MOVIE_REPOSITORY_PORT');