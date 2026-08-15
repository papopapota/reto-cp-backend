import { MovieRepositoryPort } from "src/movie/application/ports";
import { Movie } from "src/movie/domain/entities";
import { PrismaService } from "src/prisma/prisma.service";
import { MovieMapper } from "../mappers";

export class PrismaMovieRepositoryAdapter implements MovieRepositoryPort {

    constructor(
        private prisma: PrismaService
    ) { }

    async create(movie: Movie): Promise<Movie> {
        const prismaMovie = MovieMapper.toPersistence(movie);
        return this.prisma.movieModel.create({ data: prismaMovie }).then((createdMovie) => {
            return MovieMapper.toDomain(createdMovie);
        });
    }
    async update(id: string, movie: Partial<Movie>): Promise<void> {
        const prismaMovie = MovieMapper.toPersistence(movie as Movie);
        return this.prisma.movieModel.update({ where: { id }, data: prismaMovie }).then(() => { });
    }
    async findById(id: string): Promise<Movie | null> {
        return this.prisma.movieModel.findUnique({ where: { id } }).then((movie) => {
            return movie ? MovieMapper.toDomain(movie) : null;
        });
    }
    async delete(id: string): Promise<void> {
        return this.prisma.movieModel.delete({ where: { id } }).then(() => { });
    }

}