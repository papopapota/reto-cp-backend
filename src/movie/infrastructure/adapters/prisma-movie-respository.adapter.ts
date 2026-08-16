import { Movie, MovieProps } from "src/movie/domain/entities";
import { PrismaService } from "src/prisma/prisma.service";
import { MovieMapper } from "../mappers";
import { Injectable } from "@nestjs/common";
import { MovieQuery, MovieRepositoryPort, PaginatedResult, UpdateMovieData } from "src/movie/domain/ports";
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
            OR: [
                { deletedAt: { isSet: false } },
                { deletedAt: null }
            ]
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
    async update(id: string, updateMovieData: UpdateMovieData): Promise<Movie> {
        const cleanData = Object.fromEntries(
            Object.entries(updateMovieData).filter(([_, value]) => value !== undefined)
        );
        const prismaUpdatedMovie = this.prisma.movieModel.update({ where: { id }, data: { ...cleanData, updatedAt: new Date() } });
        return MovieMapper.toDomain(await prismaUpdatedMovie);
    }
    async findById(id: string): Promise<Movie | null> {
        return this.prisma.movieModel.findUnique(
            {
                where: {
                    id,
                    OR: [
                        { deletedAt: { isSet: false } },
                        { deletedAt: null }
                    ]
                }
            }
        ).then((movie) => {
            return movie ? MovieMapper.toDomain(movie) : null;
        });
    }
    async delete(id: string): Promise<void> {
        await this.prisma.movieModel.update({ where: { id }, data: { deletedAt: new Date() } });
    }

}