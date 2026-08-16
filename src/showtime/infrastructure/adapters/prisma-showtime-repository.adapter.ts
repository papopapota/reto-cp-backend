import { PrismaService } from "src/prisma/prisma.service";
import { Showtime } from "src/showtime/domain/entities";
import { ShowtimeRepositoryPort } from "src/showtime/domain/ports";
import { ShowtimeMapper } from "../mappers";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaShowtimeRepositoryAdapter implements ShowtimeRepositoryPort {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    create(showtime: Showtime): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Showtime | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Showtime[]> {
        throw new Error("Method not implemented.");
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