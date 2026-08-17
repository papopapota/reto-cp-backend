import { BookingRepositoryPort, PropsCreateBookingWithSeatsUpdate } from "../application/ports";
import { Booking } from "../domain/entities";

export class BookingRepositoryMock implements BookingRepositoryPort {
    private bookings: Booking[] = [];
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