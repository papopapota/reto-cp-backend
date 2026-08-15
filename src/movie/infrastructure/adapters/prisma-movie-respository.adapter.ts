import { Movie } from "src/movie/domain/entities";
import { PrismaService } from "src/prisma/prisma.service";
import { MovieMapper } from "../mappers";
import { Injectable } from "@nestjs/common";
import { MovieQuery, MovieRepositoryPort, PaginatedResult } from "src/movie/domain/ports";
import { MovieGenre, Prisma } from "@prisma/client";

@Injectable()
export class PrismaMovieRepositoryAdapter implements MovieRepositoryPort {

    constructor(
        private prisma: PrismaService
    ) { }
    async findAll(
        query: MovieQuery
    ): Promise<PaginatedResult<Movie>> {
        const { page, limit, genre, rating, sortBy, sortOrder } = query;
        const prismaGenre = MovieMapper.genreToPersistence(genre as any);
        const prismaRating = MovieMapper.ratingToPersistence(rating as any);

        const skip = (page - 1) * limit;
        const where: Prisma.MovieModelWhereInput = {
            ...(prismaGenre ? { genre: prismaGenre } : {}),
            ...(prismaRating ? { rating: prismaRating } : {}),
        };
        const orderBy: Prisma.MovieModelOrderByWithRelationInput = {
            [sortBy as keyof Prisma.MovieModelOrderByWithRelationInput]: sortOrder,
        };
        const [movies, total] = await this.prisma.$transaction([
            this.prisma.movieModel.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.movieModel.count({ where }),
        ]);

        return {
            data: movies.map((movie) => MovieMapper.toDomain(movie)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            }
        };
    }
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