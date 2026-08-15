import { Module } from '@nestjs/common';
import { MovieController } from './controllers';

@Module({
  providers: [],
  imports: [
  ],
  exports: [],
  controllers: [MovieController]
})
export class MovieModule {}
