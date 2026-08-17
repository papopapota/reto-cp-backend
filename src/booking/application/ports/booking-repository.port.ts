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

export interface BookingRepositoryPort {
    createWithSeatReservation(
        props: PropsCreateBookingWithSeatsUpdate
    ): Promise<Booking>;
    getById(id: string): Promise<Booking | null>;
}

export const BOOKING_REPOSITORY_PORT = Symbol('BOOKING_REPOSITORY_PORT');