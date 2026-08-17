export const CreateBookingDtoStub = (showtimeId: string, seatsBooked?: number) => ({
    showtimeId,
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    seatsBooked: seatsBooked ?? 1,
});