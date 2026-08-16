import { Module } from '@nestjs/common';
import { SHOWTIME_REPOSITORY_PORT } from '../domain/ports';
import { PrismaShowtimeRepositoryAdapter } from './adapters';

@Module({
    providers: [
        {
            provide: SHOWTIME_REPOSITORY_PORT,
            useClass: PrismaShowtimeRepositoryAdapter,
        }
    ],
    imports: [],
    exports: [
        SHOWTIME_REPOSITORY_PORT
    ],
    controllers: [],
})
export class ShowtimeModule {}
