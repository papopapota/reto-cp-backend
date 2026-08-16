import { Inject, Injectable } from '@nestjs/common';
import { SHOWTIME_REPOSITORY_PORT, type ShowtimeRepositoryPort } from 'src/showtime/domain/ports';
import { MOVIE_REPOSITORY_PORT, type MovieRepositoryPort } from 'src/movie/domain/ports';
import { MovieNotFoundException } from 'src/movie/domain/exceptions';
import { Showtime } from 'src/showtime/domain/entities';
import { CreateShowtimeDto } from '../dtos/create-showtime.dto';
import { ShowtimeOverlapException, ShowtimePastDateException } from 'src/showtime/domain/exceptions';

const CLEANING_BUFFER_MINUTES = 15;

@Injectable()
export class CreateShowtimeUseCase {
    constructor(
        @Inject(SHOWTIME_REPOSITORY_PORT)
        private readonly showtimeRepository: ShowtimeRepositoryPort,
        @Inject(MOVIE_REPOSITORY_PORT)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(dto: CreateShowtimeDto): Promise<Showtime> {
        const movie = await this.movieRepository.findById(dto.movieId);
        if (!movie) {
            throw new MovieNotFoundException();
        }

        const newStartTime = new Date(dto.dateTime);
        if (newStartTime < new Date()) {
            throw new ShowtimePastDateException();
        };
        const totalDurationMs = (movie.getDuration() + CLEANING_BUFFER_MINUTES) * 60 * 1000;
        const newEndTime = new Date(newStartTime.getTime() + totalDurationMs);
        const overlappingShowtimes = this.showtimeRepository.findOverlappingShowtimes(
            dto.room,
            newStartTime,
            newEndTime
        );
        for (const existingShowtime of await overlappingShowtimes) {
            const currentShowtime = existingShowtime.showtime;
            const currentMovie = existingShowtime.movie;

            const existingStart = currentShowtime.getDateTime();
            const existingDurationMs = (currentMovie.getDuration() + CLEANING_BUFFER_MINUTES) * 60 * 1000;
            const existingEnd = new Date(existingStart.getTime() + existingDurationMs);
            const hasOverlap = newStartTime < existingEnd && newEndTime > existingStart;
            if (hasOverlap) {
                throw new ShowtimeOverlapException(
                    `La sala "${dto.room}" está ocupada por "${currentMovie.getTitle()}" de ${existingStart.toISOString()} a ${existingEnd.toISOString()}.`,
                );
            }
        }
        const showtime = new Showtime({
            movieId: dto.movieId,
            room: dto.room,
            dateTime: newStartTime,
            price: dto.price,
            totalSeats: dto.totalSeats,
            availableSeats: dto.totalSeats,
            deletedAt: null,
        });

        return await this.showtimeRepository.create(showtime);
    }
}