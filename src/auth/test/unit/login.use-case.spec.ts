import { Test } from "@nestjs/testing";
import { LoginUseCase } from "src/auth/application/use-case";
import { IncorrectCredentialsException } from "src/auth/domain/exceptions";
import { HASH_SERVICE_PORT, HashServicePort, TokenServicePort, TOKEN_SERVICE_PORT } from "src/auth/domain/ports";
import { HashServiceMock, TokenServiceMock } from "src/auth/mock";
import { LoginDtoStub } from "src/auth/stub";
import { USER_REPOSITORY_PORT, UserRepositoryPort } from "src/user/domain/ports";
import { UserRepositoryMock } from "src/user/mock";
import { UserStub } from "src/user/stub";

describe('LoginUseCase', () => {
    let useCase: LoginUseCase;
    let userRepository: jest.Mocked<UserRepositoryPort>;
    let hashService: jest.Mocked<HashServicePort>;
    let tokenService: jest.Mocked<TokenServicePort>;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: USER_REPOSITORY_PORT,
                    useValue: UserRepositoryMock()
                },
                {
                    provide: HASH_SERVICE_PORT,
                    useValue: HashServiceMock()
                },
                {
                    provide: TOKEN_SERVICE_PORT,
                    useValue: TokenServiceMock()
                },
                LoginUseCase,
            ]
        }).compile();

        useCase = module.get<LoginUseCase>(LoginUseCase);
        userRepository = jest.mocked(module.get(USER_REPOSITORY_PORT));
        hashService = jest.mocked(module.get(HASH_SERVICE_PORT));
        tokenService = jest.mocked(module.get(TOKEN_SERVICE_PORT));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when is called, then it should', () => {
        let result: any;
        let { password: _, ...userWithoutPassword } = UserStub();
        beforeEach(async () => {
            userRepository.findByEmail.mockResolvedValue(UserStub());
            hashService.compare.mockResolvedValue(true);
            tokenService.generateToken.mockResolvedValue('token');
            result = await useCase.execute(LoginDtoStub());
        });
        test('call the user repository with the correct email', () => {
            expect(userRepository.findByEmail).toHaveBeenCalledWith(LoginDtoStub().email);
        });
        test('call the hash service with the correct password', () => {
            expect(hashService.compare).toHaveBeenCalledWith(LoginDtoStub().password, UserStub().password);
        });
        test('return the access token', async () => {
            expect(result).toEqual({ accessToken: 'token' });
        });
    });
    describe('when the email is incorrect, then it should', () => {
        let error: any;
        beforeEach(async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            try {
                await useCase.execute(LoginDtoStub());
            } catch (e) {
                error = e;
            }
        });
        test('throw a IncorrectCredentialsException', async () => {
            expect(error).toBeInstanceOf(IncorrectCredentialsException);
        });
        test('not call the hash service', () => {
            expect(hashService.compare).not.toHaveBeenCalled();
        });
        test('not call the token service', () => {
            expect(tokenService.generateToken).not.toHaveBeenCalled();
        });
    });
    describe('when the password is incorrect, then it should', () => {
        let error: any;
        beforeEach(async () => {
            userRepository.findByEmail.mockResolvedValue(UserStub());
            hashService.compare.mockResolvedValue(false);
            try {
                await useCase.execute(LoginDtoStub());
            } catch (e) {
                error = e;
            }
        });
        test('throw a IncorrectCredentialsException', async () => {
            expect(error).toBeInstanceOf(IncorrectCredentialsException);
        });
        test('call the hash service', () => {
            expect(hashService.compare).toHaveBeenCalled();
        });
        test('not call the token service', () => {
            expect(tokenService.generateToken).not.toHaveBeenCalled();
        });
    });

});