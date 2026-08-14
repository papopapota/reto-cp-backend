import { Module } from '@nestjs/common';
import { HASH_SERVICE_PORT, TOKEN_SERVICE_PORT } from '../domain/ports';
import { BcryptHashServiceAdapter, JwtTokenServiceAdapter } from './adapters';
import { LoginUseCase, RegisterUseCase } from '../application/use-case';
import { UserModule } from 'src/user/infrastructure/user.module';
import { AuthController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';

@Module({
    providers: [
        {
            provide: HASH_SERVICE_PORT,
            useClass: BcryptHashServiceAdapter
        },
        {
            provide: TOKEN_SERVICE_PORT,
            useClass: JwtTokenServiceAdapter
        },
        RegisterUseCase,
        LoginUseCase,
    ],
    imports: [
        UserModule,
        JwtModule.register({
            secret: envs.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        })
    ],
    exports: [],
    controllers: [
        AuthController
    ],
})
export class AuthModule { }
