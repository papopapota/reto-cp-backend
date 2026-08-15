import { Module } from '@nestjs/common';
import { MovieController } from './controllers';
import { GetMoviesUseCase } from '../application/use-cases';
import { PrismaMovieRepositoryAdapter } from './adapters';
import { MOVIE_REPOSITORY_PORT } from '../domain/ports';

@Module({
  providers: [
    {
      provide: MOVIE_REPOSITORY_PORT,
      useClass: PrismaMovieRepositoryAdapter
    },
    GetMoviesUseCase
  ],
  imports: [
  ],
  exports: [],
  controllers: [MovieController]
})
export class MovieModule {}
