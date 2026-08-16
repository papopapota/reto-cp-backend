import { forwardRef, Module } from '@nestjs/common';
import { SHOWTIME_REPOSITORY_PORT } from '../domain/ports';
import { PrismaShowtimeRepositoryAdapter } from './adapters';
import { CreateShowtimeUseCase, GetAllShowtimeUseCase } from '../application/use-cases';
import { ShowtimeController } from './controllers';
import { MovieModule } from 'src/movie/infrastructure/movie.module';

@Module({
    providers: [
        {
            provide: SHOWTIME_REPOSITORY_PORT,
            useClass: PrismaShowtimeRepositoryAdapter,
        },
        GetAllShowtimeUseCase,
        CreateShowtimeUseCase
    ],
    imports: [
        forwardRef(() => MovieModule),
    ],
    exports: [
        SHOWTIME_REPOSITORY_PORT
    ],
    controllers: [
        ShowtimeController
    ],
})
export class ShowtimeModule {}
