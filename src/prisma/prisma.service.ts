import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LOGGER_PORT, type LoggerPort } from 'src/common/application/ports';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(LOGGER_PORT)
        private readonly loggerPort: LoggerPort
    ) {
        super();
    }
    async onModuleInit() {
        this.$connect();
        this.loggerPort.log('Prisma client initialized');
    }
    async onModuleDestroy() {
        this.$disconnect();
        this.loggerPort.log('Prisma client disconnected');
    }
}
