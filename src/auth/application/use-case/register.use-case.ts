import { Inject, Injectable } from "@nestjs/common";
import { User } from "src/user/domain/entities";
import { USER_REPOSITORY_PORT, type UserRepositoryPort } from "src/user/domain/ports";
import { RegisterDto } from "../dtos";
import { HASH_SERVICE_PORT, type HashServicePort } from "src/auth/domain/ports";
import { UserAlreadyExistException } from "src/auth/domain/exceptions";

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject(USER_REPOSITORY_PORT)
        private readonly userRepository: UserRepositoryPort,
        @Inject(HASH_SERVICE_PORT)
        private readonly hashService: HashServicePort
    ) { }

    async execute(userData: RegisterDto): Promise<Partial<User>> {
        const { email, password } = userData;

        const userFound = await this.userRepository.findByEmail(email);
        if (userFound) {
            throw new UserAlreadyExistException(email);
        }
        const hashedPassword = await this.hashService.hash(password);
        const user = User.create(email, hashedPassword);
        const userCreated = await this.userRepository.create(user);
        const { password: _, ...userWithoutPassword } = userCreated;
        return { ...userWithoutPassword };
    }
}