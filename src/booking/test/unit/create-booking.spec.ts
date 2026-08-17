import { Test } from "@nestjs/testing";
import { BOOKING_REPOSITORY_PORT } from "src/booking/application/ports";
import { CreateBookingUseCase } from "src/booking/application/use-cases";
import { InsufficientSeatsException } from "src/booking/domain/exceptions";
import { BookingRepositoryMock } from "src/booking/mock";
import { CreateBookingDtoStub } from "src/booking/stub/create-booking.dto.stub";
import { MOVIE_REPOSITORY_PORT } from "src/movie/domain/ports";
import { MovieRepositoryMock } from "src/movie/mock";
import { Showtime } from "src/showtime/domain/entities";
import { ShowtimeClosedException, ShowtimeNotFoundException } from "src/showtime/domain/exceptions";
import { SHOWTIME_REPOSITORY_PORT, ShowtimeRepositoryPort } from "src/showtime/domain/ports";
import { ShowtimeRepositoryMock } from "src/showtime/mock";
import { Seeder } from "test/utils/seeder";

describe('CreateBookingUseCase', () => {
    let useCase: CreateBookingUseCase;
    let showtimeRepository: jest.Mocked<ShowtimeRepositoryPort>;
    let bookingRepository: jest.Mocked<BookingRepositoryMock>;
    let showtimeFindByIdSpy: jest.SpyInstance;
    let createWithSeatReservationSpy: jest.SpyInstance;
    let seeder: Seeder;
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
                CreateBookingUseCase,
            ]
        }).compile();

        useCase = module.get<CreateBookingUseCase>(CreateBookingUseCase);
        showtimeRepository = jest.mocked(module.get(SHOWTIME_REPOSITORY_PORT));
        bookingRepository = jest.mocked(module.get(BOOKING_REPOSITORY_PORT));
        movieRepository = jest.mocked(module.get(MOVIE_REPOSITORY_PORT));
        showtimeFindByIdSpy = jest.spyOn(showtimeRepository, 'findById');
        createWithSeatReservationSpy = jest.spyOn(bookingRepository, 'createWithSeatReservation');
        seeder = new Seeder(
            movieRepository,
            showtimeRepository
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when is called, then it should', () => {
        describe('with a valid showtime and enough available seats', () => {
            let result: any;
            let dto: any;
            let showtime: Showtime;
            beforeEach(async () => {
                const movies = await seeder.addMoviesToRepository();
                showtime = await showtimeRepository.create(new Showtime({
                    movieId: movies[0].getId()!,
                    room: 'Room 1',
                    dateTime: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
                    price: 10.0,
                    totalSeats: 100,
                    availableSeats: 100,
                }));
                dto = CreateBookingDtoStub(showtime.getId()!, 2)
                result = await useCase.execute(dto);
            });
            test('call the showtime repository with the correct showtime id', () => {
                expect(showtimeFindByIdSpy).toHaveBeenCalledWith(dto.showtimeId);
            });
            test('call the booking repository with the correct showtime id and number of seats', () => {
                expect(createWithSeatReservationSpy).toHaveBeenCalledWith(expect.objectContaining({
                    showtimeId: dto.showtimeId,
                    seatsToDeduct: dto.seatsBooked,
                    bookingData: expect.objectContaining({
                        customerName: dto.customerName,
                        customerEmail: dto.customerEmail,
                        seatsBooked: dto.seatsBooked,
                        totalPrice: expect.any(Number),
                    }),
                }));
            });
            test('return the correct totalPrice in the booking', () => {
                const expectedTotalPrice = showtime.getPrice() * dto.seatsBooked;
                expect(createWithSeatReservationSpy).toHaveBeenCalledWith(expect.objectContaining({
                    bookingData: expect.objectContaining({
                        totalPrice: expectedTotalPrice,
                    }),
                }));
            });
            test('return the created booking', () => {
                expect(result).toEqual(expect.objectContaining({
                    showtimeId: dto.showtimeId,
                    customerName: dto.customerName,
                    customerEmail: dto.customerEmail,
                    seatsBooked: dto.seatsBooked,
                    totalPrice: showtime.getPrice() * dto.seatsBooked,
                }));
            });
        });
        describe('with a non-existing showtime', () => {
            let dto: any;
            let error: any;
            beforeEach(async () => {
                dto = CreateBookingDtoStub('non-existing-showtime-id', 2);
                try {
                    await useCase.execute(dto);
                } catch (err) {
                    error = err;
                }
            });
            test('throw ShowtimeNotFoundException', async () => {
                await expect(error).toBeInstanceOf(ShowtimeNotFoundException);
            });
        });
        describe('with a showtime that has already started', () => {
            let dto: any;
            let showtime: Showtime;
            let error: any;
            beforeEach(async () => {
                const movies = await seeder.addMoviesToRepository();
                showtime = await showtimeRepository.create(new Showtime({
                    movieId: movies[0].getId()!,
                    room: 'Room 1',
                    dateTime: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
                    price: 10.0,
                    totalSeats: 100,
                    availableSeats: 100,
                }));
                dto = CreateBookingDtoStub(showtime.getId()!, 2);
                try {
                    await useCase.execute(dto);
                } catch (err) {
                    error = err;
                }
            });
            test('throw ShowtimeClosedException', async () => {
                await expect(error).toBeInstanceOf(ShowtimeClosedException);
            });
        });
        describe('with a showtime that does not have enough available seats', () => {
            let dto: any;
            let showtime: Showtime;
            let error: any;
            beforeEach(async () => {
                const movies = await seeder.addMoviesToRepository();
                showtime = await showtimeRepository.create(new Showtime({
                    movieId: movies[0].getId()!,
                    room: 'Room 1',
                    dateTime: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
                    price: 10.0,
                    totalSeats: 100,
                    availableSeats: 1, // Only 1 seat available
                }));
                dto = CreateBookingDtoStub(showtime.getId()!, 2); // Requesting 2 seats
                try {
                    await useCase.execute(dto);
                } catch (err) {
                    error = err;
                }
            });
            test('throw InsufficientSeatsException', async () => {
                await expect(error).toBeInstanceOf(InsufficientSeatsException);
            });
        });
    });

});