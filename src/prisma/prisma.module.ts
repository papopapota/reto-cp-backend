import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PRISMA_LOGGER_PORT } from 'src/common/application/ports';
import { LoggerAdapter } from 'src/common/infrastructure/adapters';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: PRISMA_LOGGER_PORT,
      useFactory: () => {
        return new LoggerAdapter("Prisma");
      }
    }
  ],
  exports: [
    PrismaService
  ]
})
export class PrismaModule {}
