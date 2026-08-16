import { Module } from '@nestjs/common';
import { BookingController } from './controllers';

@Module({
  controllers: [BookingController]
})
export class BookingModule {}
