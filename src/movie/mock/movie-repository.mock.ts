import { Movie } from "../domain/entities";
import { MovieQuery, MovieRepositoryPort, PaginatedResult, UpdateMovieData } from "../domain/ports";

export class MovieRepositoryMock implements MovieRepositoryPort {
    public movies: Movie[] = [];

    async create(movie: Movie): Promise<Movie> {
        const newMovie = new Movie({
            title: movie.getTitle(),
            synopsis: movie.getSynopsis(),
            duration: movie.getDuration(),
            genre: movie.getGenre(),
            rating: movie.getRating(),
            deletedAt: null,
        });
        this.movies.push(newMovie);
        return Promise.resolve(newMovie);
    }

    async findById(id: string): Promise<Movie | null> {
        return this.movies.find((m) => m.getId() === id && !m.getDeletedAt()) ?? null;
    }

    async update(id: string, updateMovieData: UpdateMovieData): Promise<Movie> {
        const index = this.movies.findIndex((m) => m.getId() === id);
        if (index !== -1) {
            Object.assign(this.movies[index], updateMovieData);
        }
        return new Promise((resolve) => {
            resolve(this.movies[index]);
        });
    }

    async delete(id: string): Promise<void> {
        this.movies = this.movies.map((m) => {
            if (m.getId() === id) {
                m.setDeletedAt();
            }
            return m;
        });
    }

    async findAll(query: MovieQuery): Promise<PaginatedResult<Movie>> {
        const {
            page = 1,
            limit = 10,
            genre,
            rating,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        // 1. Filtrar
        let result = this.movies.filter((m) => {
            if (genre && m.getGenre() !== genre) return false;
            if (rating && m.getRating() !== rating) return false;
            if (m.isDeleted()) return false;
            return true;
        });

        // 2. Ordenar
        result.sort((a, b) => {
            const valA = (a as any)[sortBy];
            const valB = (b as any)[sortBy];

            if (valA === valB) return 0;
            if (valA === undefined || valA === null) return 1;
            if (valB === undefined || valB === null) return -1;

            const comparison = valA > valB ? 1 : -1;
            return sortOrder.toLowerCase() === 'desc' ? -comparison : comparison;
        });

        // 3. Paginar
        const total = result.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const skip = (page - 1) * limit;
        const data = result.slice(skip, skip + limit);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
}