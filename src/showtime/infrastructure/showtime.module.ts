import { Module } from '@nestjs/common';
import { SHOWTIME_REPOSITORY_PORT } from '../domain/ports';
import { PrismaShowtimeRepositoryAdapter } from './adapters';
import { GetAllShowtimeUseCase } from '../application/use-cases';
import { ShowtimeController } from './controllers';

@Module({
    providers: [
        {
            provide: SHOWTIME_REPOSITORY_PORT,
            useClass: PrismaShowtimeRepositoryAdapter,
        },
        GetAllShowtimeUseCase
    ],
    imports: [],
    exports: [
        SHOWTIME_REPOSITORY_PORT
    ],
    controllers: [
        ShowtimeController
    ],
})
export class ShowtimeModule {}
