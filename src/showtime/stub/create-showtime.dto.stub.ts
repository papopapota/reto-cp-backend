export const CreateShowtimeDtoStub = (movieId: string) => ({
    movieId: movieId,
    room: 'room-1',
    dateTime: new Date( new Date().getTime() + 3600000 ).toISOString(),
    price: 10,
    totalSeats: 100,
});