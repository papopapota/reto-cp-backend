import { Inject, Injectable } from "@nestjs/common";
import { SHOWTIME_REPOSITORY_PORT, type ShowtimeRepositoryPort } from "src/showtime/domain/ports/showtime-repository.port";

@Injectable()
export class GetAllShowtimeUseCase {
    constructor(
        @Inject(SHOWTIME_REPOSITORY_PORT)
        private readonly showtimeRepository: ShowtimeRepositoryPort,
    ) { }

    execute() {
        return this.showtimeRepository.findAll();
    }
}