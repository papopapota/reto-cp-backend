import { PrismaService } from "src/prisma/prisma.service";
import { Showtime } from "src/showtime/domain/entities";
import { ShowtimeFilterOptions, ShowtimeRepositoryPort, ShowtimeWithMovie } from "src/showtime/domain/ports";
import { ShowtimeMapper } from "../mappers";
import { Injectable } from "@nestjs/common";
import { PaginatedResultPort } from "src/common/application/ports";
import { Prisma } from "@prisma/client";
import { MovieMapper } from "src/movie/infrastructure/mappers/movie.mapper";

@Injectable()
export class PrismaShowtimeRepositoryAdapter implements ShowtimeRepositoryPort {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    async findOverlappingShowtimes(room: string, startTime: Date, endTime: Date): Promise<ShowtimeWithMovie[]> {
        const windowStart = new Date(startTime.getTime() - 4 * 60 * 60 * 1000); // 4 horas antes
        const windowEnd = new Date(endTime.getTime() + 4 * 60 * 60 * 1000);    // 4 horas después

        const showtimes = await this.prisma.showtimeModel.findMany({
            where: {
                room,
                dateTime: {
                    gte: windowStart,
                    lte: windowEnd,
                },
                OR: [
                    { deletedAt: { isSet: false } },
                    { deletedAt: null },
                ],
            },
            include: {
                movieModel: true,
            },
        });

        return showtimes.map((showtime) => ({
            showtime: ShowtimeMapper.toDomain(showtime),
            movie: MovieMapper.toDomain({...showtime.movieModel!}),
        }));
    }
    async create(showtime: Showtime): Promise<Showtime> {
        const showtimeData = ShowtimeMapper.toPersistence(showtime);
        return this.prisma.showtimeModel.create({ data: showtimeData }).then((createdShowtime) => {
            return ShowtimeMapper.toDomain(createdShowtime);
        });
    }
    findById(id: string): Promise<Showtime | null> {
        throw new Error("Method not implemented.");
    }
    async findAll(filters: ShowtimeFilterOptions): Promise<PaginatedResultPort<Showtime>> {
        const { page, limit, movieId, date, minPrice, maxPrice } = filters;
        const skip = (page - 1) * limit;
        const where: Prisma.ShowtimeModelWhereInput = {
            OR: [
                { deletedAt: { isSet: false } },
                { deletedAt: null },
            ],
        };
        if (movieId) {
            where.movieModelId = movieId;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {
                ...(minPrice !== undefined ? { gte: minPrice } : {}),
                ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            };
        }
        if (date) {
            const startOfDay = new Date(`${date}T00:00:00.000Z`);
            const endOfDay = new Date(`${date}T23:59:59.999Z`);
            where.dateTime = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
        const [total, showtimes] = await Promise.all([
            this.prisma.showtimeModel.count({ where }),
            this.prisma.showtimeModel.findMany({
                where,
                skip,
                take: limit,
                orderBy: { dateTime: 'asc' },
            }),
        ]);
        return {
            data: showtimes.map(ShowtimeMapper.toDomain),
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
    async findUpcomingByMovieId(movieId: string): Promise<Showtime[]> {
        return this.prisma.showtimeModel.findMany({
            where: {
                movieModelId: movieId,
                dateTime: {
                    gte: new Date()
                },
                OR: [
                    { deletedAt: { isSet: false } },
                    { deletedAt: null }
                ]
            },
            orderBy: {
                dateTime: 'asc'
            }
        }).then((showtimes) => {
            return showtimes.map((showtime) => ShowtimeMapper.toDomain(showtime));
        });
    }
    update(showtime: Showtime): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}