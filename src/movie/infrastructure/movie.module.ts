import { Module } from '@nestjs/common';
import { MovieController } from './controllers';
import { CreateMovieUseCase, GetAllMoviesUseCase, GetMovieWithShowtimeUseCase, DeleteMovieUseCase, UpdateMovieUseCase } from '../application/use-cases';
import { PrismaMovieRepositoryAdapter } from './adapters';
import { MOVIE_REPOSITORY_PORT } from '../domain/ports';
import { ShowtimeModule } from 'src/showtime/infrastructure/showtime.module';

@Module({
  providers: [
    {
      provide: MOVIE_REPOSITORY_PORT,
      useClass: PrismaMovieRepositoryAdapter
    },
    GetAllMoviesUseCase,
    CreateMovieUseCase,
    GetMovieWithShowtimeUseCase,
    UpdateMovieUseCase,
    DeleteMovieUseCase
  ],
  imports: [
    ShowtimeModule
  ],
  exports: [
    MOVIE_REPOSITORY_PORT
  ],
  controllers: [MovieController]
})
export class MovieModule {}
