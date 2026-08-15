import { Movie } from "src/movie/domain/entities";

export interface MovieRepositoryPort {
    create(movie: Movie): Promise<Movie>;
    update(id: string, movie: Partial<Movie>): Promise<void>;
    findById(id: string): Promise<Movie | null>;
    delete(id: string): Promise<void>;
}