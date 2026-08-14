import { Module } from '@nestjs/common';
import { USER_REPOSITORY_PORT } from '../domain/ports';
import { PrismaUserRepositoryAdapter } from './adapters/prisma-user-repository.adapter';

@Module({
    providers: [
        {
            provide: USER_REPOSITORY_PORT,
            useClass: PrismaUserRepositoryAdapter,
        }
    ],
    imports: [],
    exports: [
        USER_REPOSITORY_PORT
    ],
    controllers: [],
})
export class UserModule {}
