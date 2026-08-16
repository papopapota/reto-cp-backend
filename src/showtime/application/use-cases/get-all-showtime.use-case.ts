import { Inject, Injectable } from "@nestjs/common";
import { SHOWTIME_REPOSITORY_PORT, type ShowtimeRepositoryPort } from "src/showtime/domain/ports/showtime-repository.port";
import { QueryShowtimeDto } from "../dtos";

@Injectable()
export class GetAllShowtimeUseCase {
    constructor(
        @Inject(SHOWTIME_REPOSITORY_PORT)
        private readonly showtimeRepository: ShowtimeRepositoryPort,
    ) { }

    execute(
        query: QueryShowtimeDto
    ) {
        return this.showtimeRepository.findAll(
            {
                movieId: query.movieId ?? undefined,
                date: query.date ?? undefined,
                minPrice: query.minPrice ?? undefined,
                maxPrice: query.maxPrice ?? undefined,
                page: query.page ?? 1,
                limit: query.limit ?? 10
            }
        );
    }
}