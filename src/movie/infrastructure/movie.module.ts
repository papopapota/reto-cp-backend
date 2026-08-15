import { Module } from '@nestjs/common';
import { MovieController } from './controllers';
import { CreateMovieUseCase, GetAllMoviesUseCase } from '../application/use-cases';
import { PrismaMovieRepositoryAdapter } from './adapters';
import { MOVIE_REPOSITORY_PORT } from '../domain/ports';

@Module({
  providers: [
    {
      provide: MOVIE_REPOSITORY_PORT,
      useClass: PrismaMovieRepositoryAdapter
    },
    GetAllMoviesUseCase,
    CreateMovieUseCase
  ],
  imports: [
  ],
  exports: [],
  controllers: [MovieController]
})
export class MovieModule {}
