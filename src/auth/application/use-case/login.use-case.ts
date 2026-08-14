import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY_PORT, type UserRepositoryPort } from "src/user/domain/ports";
import { LoginDto } from "../dtos";
import { HASH_SERVICE_PORT, TOKEN_SERVICE_PORT, type TokenServicePort, type HashServicePort } from "src/auth/domain/ports";
import { IncorrectCredentialsException } from "src/auth/domain/exceptions";

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(USER_REPOSITORY_PORT)
        private readonly userRepository: UserRepositoryPort,
        @Inject(HASH_SERVICE_PORT)
        private readonly hashService: HashServicePort,
        @Inject(TOKEN_SERVICE_PORT)
        private readonly tokenService: TokenServicePort,
    ) { }

    async execute(userData: LoginDto): Promise<{ accessToken: string }> {
        const { email, password } = userData;

        const userFound = await this.userRepository.findByEmail(email);
        if (!userFound) {
            throw new IncorrectCredentialsException();
        }
        const isValidPassword = await this.hashService.compare(password, userFound.getPassword());
        if (!isValidPassword) {
            throw new IncorrectCredentialsException();
        }
        const { password: _, ...userWithoutPassword } = userFound;
        const accessToken = await this.tokenService.generateToken({
            userId: userWithoutPassword.id!,
            rol: 'user',
        });
        return { accessToken };
    }
}