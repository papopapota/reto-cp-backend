import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterDto } from 'src/auth/application/dtos';
import { RegisterUseCase } from 'src/auth/application/use-case';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase
    ) { }
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() registerDto: RegisterDto
    ) {
        return this.registerUseCase.execute(registerDto);
    }
}
