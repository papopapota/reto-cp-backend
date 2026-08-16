import { BookingModel } from "@prisma/client";
import { Booking } from "src/booking/domain/entities";

export class BookingMapper {
    static toDomain(booking: BookingModel): Booking {
        return new Booking(
            {
                id: booking.id,
                showtimeId: booking.showtimeId,
                customerName: booking.customerName,
                customerEmail: booking.customerEmail,
                seatsBooked: booking.seatsBooked,
                totalPrice: booking.totalPrice,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            }
        );
    }
    static toPersistence(booking: Booking): BookingModel {
        return {
            id: booking.getId(),
            showtimeId: booking.getShowtimeId(),
            customerName: booking.getCustomerName(),
            customerEmail: booking.getCustomerEmail(),
            seatsBooked: booking.getSeatsBooked(),
            totalPrice: booking.getTotalPrice(),
            createdAt: booking.getCreatedAt(),
            updatedAt: booking.getUpdatedAt()
        };
    }
}