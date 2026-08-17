import { Module } from '@nestjs/common';
import { BookingController } from './controllers';
import { CreateBookingUseCase, GetBookingDetailsUseCase } from '../application/use-cases';
import { BOOKING_REPOSITORY_PORT } from '../domain/ports';
import { PrismaBookingRepositoryAdapter } from './adapters';
import { ShowtimeModule } from 'src/showtime/infrastructure/showtime.module';

@Module({
  exports: [],
  providers: [
    {
      provide: BOOKING_REPOSITORY_PORT,
      useClass: PrismaBookingRepositoryAdapter
    },
    CreateBookingUseCase,
    GetBookingDetailsUseCase
  ],
  imports: [
    ShowtimeModule
  ],
  controllers: [BookingController]
})
export class BookingModule {}
