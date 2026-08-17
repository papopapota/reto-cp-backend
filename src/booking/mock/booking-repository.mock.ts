import { BookingDetails, BookingRepositoryPort, PropsCreateBookingWithSeatsUpdate } from "../domain/ports";
import { Booking } from "../domain/entities";

export class BookingRepositoryMock implements BookingRepositoryPort {
    private bookings: Booking[] = [];
    findByIdWithDetails(id: string): Promise<BookingDetails | null> {
        const booking = this.bookings.find(b => b.getId() === id);
        if (!booking) {
            return Promise.resolve(null);
        }
        const details: BookingDetails = {
            booking,
            showtime: {
                id: booking.getShowtimeId(),
                room: "Room 1",
                dateTime: new Date(),
                price: booking.getTotalPrice() / booking.getSeatsBooked(),
            },
            movie: {
                id: "movie-id",
                title: "Movie Title",
                duration: 120,
                genre: "Action",
                rating: "PG-13",
            },
        };
        return Promise.resolve(details);
    }
    createWithSeatReservation(props: PropsCreateBookingWithSeatsUpdate): Promise<Booking> {
        const { showtimeId, seatsToDeduct, bookingData } = props;
        const booking = new Booking({
            showtimeId,
            customerName: bookingData.customerName,
            customerEmail: bookingData.customerEmail,
            seatsBooked: bookingData.seatsBooked,
            totalPrice: bookingData.totalPrice,
        });
        this.bookings.push(booking);
        return Promise.resolve(booking);
    }
    getById(id: string): Promise<Booking | null> {
        const booking = this.bookings.find(b => b.getId() === id);
        if (!booking) {
            return Promise.resolve(null);
        }
        return Promise.resolve(booking);
    }
}