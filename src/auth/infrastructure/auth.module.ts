import { Module } from '@nestjs/common';
import { HASH_SERVICE_PORT } from '../domain/ports';
import { BcryptHashServiceAdapter } from './adapters';
import { RegisterUseCase } from '../application/use-case';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';

@Module({
    providers: [
        {
            provide: HASH_SERVICE_PORT,
            useClass: BcryptHashServiceAdapter
        },
        RegisterUseCase
    ],
    imports: [
        UserModule,
        JwtModule.register({
            secret: envs.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
            global: true,
        })
    ],
    exports: [],
    controllers: [
        AuthController
    ],
})
export class AuthModule {}
