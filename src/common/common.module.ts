import { Global, Module } from '@nestjs/common';
import { LOGGER_PORT } from './application/ports';
import { LoggerAdapter } from './infrastructure/adapters';
@Global()
@Module({
    providers: [
        {
            provide: LOGGER_PORT,
            useClass: LoggerAdapter
        }
    ],
    imports: [],
    exports: [
        LOGGER_PORT
    ],
    controllers: [],
})
export class CommonModule {}
