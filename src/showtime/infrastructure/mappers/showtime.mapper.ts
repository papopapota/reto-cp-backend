import { ShowtimeModel } from "@prisma/client";
import { Showtime } from "src/showtime/domain/entities";

export class ShowtimeMapper {
    static toDomain(prismaShowtime: ShowtimeModel): Showtime {
        return new Showtime(
            {
                id: prismaShowtime.id,
                movieId: prismaShowtime.movieModelId!,
                room: prismaShowtime.room,
                dateTime: prismaShowtime.dateTime,
                price: prismaShowtime.price,
                totalSeats: prismaShowtime.totalSeats,
                availableSeats: prismaShowtime.availableSeats,
                deletedAt: prismaShowtime.deletedAt,
                createdAt: prismaShowtime.createdAt,
                updatedAt: prismaShowtime.updatedAt
            }
        );
    };

    static toPersistence(showtime: Showtime): ShowtimeModel {
        return {
            id: showtime.getId()!,
            movieModelId: showtime.getMovieId(),
            room: showtime.getRoom(),
            dateTime: showtime.getDateTime(),
            price: showtime.getPrice(),
            totalSeats: showtime.getTotalSeats(),
            availableSeats: showtime.getAvailableSeats(),
            deletedAt: showtime.getDeletedAt(),
            createdAt: showtime.getCreatedAt()!,
            updatedAt: showtime.getUpdatedAt()!
        };
    }
}