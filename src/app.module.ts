import { Module } from '@nestjs/common';
import { AuthModule } from './auth/infrastructure/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/infrastructure/user.module';
import { MovieModule } from './movie/infrastructure/movie.module';
import { ShowtimeModule } from './showtime/infrastructure/showtime.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    CommonModule,
    UserModule,
    MovieModule,
    ShowtimeModule
  ],
  controllers: [
  ],
  providers: [],
})
export class AppModule { }
