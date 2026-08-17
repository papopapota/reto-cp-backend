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
    /**
   * Ejecuta una transacción atómica que descuenta los asientos solicitados de la sala
   * y registra la reserva en una única operación consistente.
   *
   * @param props - Parámetros requeridos para la transacción (identificador de función, cantidad de asientos y datos del cliente).
   * @returns La entidad `Booking` generada y persistida.
   *
   * @throws {InsufficientSeatsException} Si al momento de ejecutar la operación atómica los asientos ya no están disponibles.
   */
    createWithSeatReservation(
        props: PropsCreateBookingWithSeatsUpdate
    ): Promise<Booking>;
    getById(id: string): Promise<Booking | null>;
    /**
   * Recupera una reserva por su identificador, resolviendo las relaciones con la función y película asociada.
   *
   * @param id - Identificador único de la reserva.
   * @returns Estructura con la reserva y sus entidades relacionadas, o `null` si no existe.
   */
    findByIdWithDetails(id: string): Promise<BookingDetails | null>;
}

export const BOOKING_REPOSITORY_PORT = Symbol('BOOKING_REPOSITORY_PORT');