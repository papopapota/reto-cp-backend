import { Booking } from "src/booking/domain/entities";

export interface CreateBookingWithSeatsUpdate {
    booking: Booking;
    seatsToDeduct: number;
}

export interface PropsCreateBookingWithSeatsUpdate {
    showtimeId: string;
    seatsToDeduct: number;
    bookingData: {
        customerName: string;
        customerEmail: string;
        seatsBooked: number;
        totalPrice: number;
    };
}
export interface BookingDetails {
    booking: Booking;
    showtime: {
        id: string;
        room: string;
        dateTime: Date;
        price: number;
    };
    movie: {
        id: string;
        title: string;
        duration: number;
        genre: string;
        rating: string;
    };
}
export interface BookingRepositoryPort {
    createWithSeatReservation(
        props: PropsCreateBookingWithSeatsUpdate
    ): Promise<Booking>;
    getById(id: string): Promise<Booking | null>;
    findByIdWithDetails(id: string): Promise<BookingDetails | null>;
}

export const BOOKING_REPOSITORY_PORT = Symbol('BOOKING_REPOSITORY_PORT');