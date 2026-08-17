import { Test } from "@nestjs/testing";
import { BOOKING_REPOSITORY_PORT } from "src/booking/domain/ports";
import { BookingNotFoundException, InsufficientSeatsException } from "src/booking/domain/exceptions";
import { BookingRepositoryMock } from "src/booking/mock";
import { CreateBookingDtoStub } from "src/booking/stub/create-booking.dto.stub";
import { MOVIE_REPOSITORY_PORT } from "src/movie/domain/ports";
import { MovieRepositoryMock } from "src/movie/mock";
import { Showtime } from "src/showtime/domain/entities";
import { ShowtimeClosedException, ShowtimeNotFoundException } from "src/showtime/domain/exceptions";
import { SHOWTIME_REPOSITORY_PORT, ShowtimeRepositoryPort } from "src/showtime/domain/ports";
import { ShowtimeRepositoryMock } from "src/showtime/mock";
import { Seeder } from "test/utils/seeder";
import { GetBookingDetailsUseCase } from "src/booking/application/use-cases";

describe('GetBookingDetailsUseCase', () => {
    let useCase: GetBookingDetailsUseCase;
    let bookingRepository: jest.Mocked<BookingRepositoryMock>;
    let findByIdWithDetailsSpy: jest.SpyInstance;
    let seeder: Seeder;
    let showtimeRepository: jest.Mocked<ShowtimeRepositoryPort>;
    let movieRepository: jest.Mocked<MovieRepositoryMock>;
    beforeAll(async () => { });
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: SHOWTIME_REPOSITORY_PORT,
                    useValue: new ShowtimeRepositoryMock()
                },
                {
                    provide: BOOKING_REPOSITORY_PORT,
                    useValue: new BookingRepositoryMock()
                },
                {
                    provide: MOVIE_REPOSITORY_PORT,
                    useValue: new MovieRepositoryMock()
                },
                GetBookingDetailsUseCase,
            ]
        }).compile();

        useCase = module.get<GetBookingDetailsUseCase>(GetBookingDetailsUseCase);
        showtimeRepository = jest.mocked(module.get(SHOWTIME_REPOSITORY_PORT));
        bookingRepository = jest.mocked(module.get(BOOKING_REPOSITORY_PORT));
        movieRepository = jest.mocked(module.get(MOVIE_REPOSITORY_PORT));
        findByIdWithDetailsSpy = jest.spyOn(bookingRepository, 'findByIdWithDetails');
        seeder = new Seeder(
            movieRepository,
            showtimeRepository
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('when is called, then it should', () => {
        describe('with a valid booking id', () => {
            let result: any;
            let booking: any;
            beforeEach(async () => {
                const movies = await seeder.addMoviesToRepository();
                const showtimes = (await seeder.addShowtimesToMovies(movies)).data;
                const showtimeJson: any = showtimes[0];
                const showtime = new Showtime({
                    movieId: showtimeJson.movieId,
                    room: showtimeJson.room,
                    dateTime: new Date(showtimeJson.dateTime),
                    price: showtimeJson.price,
                    totalSeats: showtimeJson.totalSeats,
                });
                const bookingDto = CreateBookingDtoStub(showtime.getId()!, 2);
                booking = await bookingRepository.createWithSeatReservation({
                    showtimeId: showtime.getId()!,
                    seatsToDeduct: bookingDto.seatsBooked,
                    bookingData: {
                        customerName: bookingDto.customerName,
                        customerEmail: bookingDto.customerEmail,
                        seatsBooked: bookingDto.seatsBooked,
                        totalPrice: showtime.getPrice() * bookingDto.seatsBooked
                    }
                });
                result = await useCase.execute(booking.getId()!);
            });
            test('call the booking repository with the correct id', () => {
                expect(findByIdWithDetailsSpy).toHaveBeenCalledWith(booking.getId()!);
            });
            test('return the correct booking data', () => {
                expect(result.booking).toEqual(expect.objectContaining({
                    id: booking.getId(),
                    customerName: booking.getCustomerName(),
                    customerEmail: booking.getCustomerEmail(),
                    seatsBooked: booking.getSeatsBooked(),
                    totalPrice: booking.getTotalPrice()
                }));
            });
            test('return the correct movie data', () => {
                expect(result.movie).toEqual(expect.objectContaining({
                    id: expect.any(String),
                    title: expect.any(String),
                    duration: expect.any(Number),
                    genre: expect.any(String),
                    rating: expect.any(String)
                }));
            });
            test('return the correct showtime data', () => {
                expect(result.showtime).toEqual(expect.objectContaining({
                    id: expect.any(String),
                    room: expect.any(String),
                    dateTime: expect.any(Date),
                    price: expect.any(Number)
                }));
            });
        });
        describe('with an invalid booking id', () => {
            let error: any;
            beforeEach(async () => {
                try {
                    await useCase.execute('invalid-booking-id');
                } catch (err) {
                    error = err;
                }
            });
            test('call the booking repository with the correct id', () => {
                expect(findByIdWithDetailsSpy).toHaveBeenCalledWith('invalid-booking-id');
            });
            test('throw BookingNotFoundException', async () => {
                await expect(error).toBeInstanceOf(BookingNotFoundException);
            });
        });
    });
});