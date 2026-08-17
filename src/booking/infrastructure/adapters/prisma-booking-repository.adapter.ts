import { Injectable } from "@nestjs/common";
import { BookingDetails, BookingRepositoryPort, PropsCreateBookingWithSeatsUpdate } from "src/booking/domain/ports";
import { Booking } from "src/booking/domain/entities";
import { PrismaService } from "src/prisma/prisma.service";
import { BookingMapper } from "../mappers";
import { InsufficientSeatsException } from "src/booking/domain/exceptions";

@Injectable()
export class PrismaBookingRepositoryAdapter implements BookingRepositoryPort {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    async findByIdWithDetails(id: string): Promise<BookingDetails | null> {
        const rawBooking = await this.prisma.bookingModel.findUnique({
            where: { id },
            include: {
                showtime: {
                    include: {
                        movieModel: true,
                    },
                },
            },
        });

        if (!rawBooking || !rawBooking.showtime) {
            return null;
        }

        return {
            booking: BookingMapper.toDomain(rawBooking),
            showtime: {
                id: rawBooking.showtime.id,
                room: rawBooking.showtime.room,
                dateTime: rawBooking.showtime.dateTime,
                price: rawBooking.showtime.price,
            },
            movie: {
                id: rawBooking.showtime.movieModel?.id!,
                title: rawBooking.showtime.movieModel?.title ?? 'Sin título',
                duration: rawBooking.showtime.movieModel?.duration ?? 0,
                genre: rawBooking.showtime.movieModel?.genre ?? '',
                rating: rawBooking.showtime.movieModel?.rating ?? '',
            },
        };
    }

    async createWithSeatReservation(props: PropsCreateBookingWithSeatsUpdate): Promise < Booking > {
    const { showtimeId, seatsToDeduct, bookingData } = props;
    return await this.prisma.$transaction(async (tx) => {
        const updateResult = await tx.showtimeModel.updateMany({
            where: {
                id: showtimeId,
                availableSeats: { gte: seatsToDeduct },
                OR: [
                    { deletedAt: { isSet: false } },
                    { deletedAt: null },
                ],
            },
            data: {
                availableSeats: { decrement: seatsToDeduct },
            },
        });
        if (updateResult.count === 0) {
            throw new InsufficientSeatsException();
        }
        const createdBooking = await tx.bookingModel.create({
            data: {
                showtimeId,
                customerName: bookingData.customerName,
                customerEmail: bookingData.customerEmail,
                seatsBooked: bookingData.seatsBooked,
                totalPrice: bookingData.totalPrice,
            },
        });

        return BookingMapper.toDomain(createdBooking);
    });
}
getById(id: string): Promise < Booking > {
    throw new Error("Method not implemented.");
}
}