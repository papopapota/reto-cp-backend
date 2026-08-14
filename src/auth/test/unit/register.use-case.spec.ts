import { Test } from "@nestjs/testing";
import { RegisterUseCase } from "src/auth/application/use-case";
import { HASH_SERVICE_PORT, HashServicePort, TOKEN_SERVICE_PORT } from "src/auth/domain/ports";
import { HashServiceMock } from "src/auth/mock";
import { RegisterDtoStub } from "src/auth/stub";
import { USER_REPOSITORY_PORT, UserRepositoryPort } from "src/user/domain/ports";
import { UserRepositoryMock } from "src/user/mock";
import { UserStub } from "src/user/stub";

describe('RegisterUseCase', () => {
    let useCase: RegisterUseCase;
    let userRepository: jest.Mocked<UserRepositoryPort>;
    let hashService: jest.Mocked<HashServicePort>;
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
                RegisterUseCase,

            ]
        }).compile();

        useCase = module.get<RegisterUseCase>(RegisterUseCase);
        userRepository = jest.mocked(module.get(USER_REPOSITORY_PORT));
        hashService = jest.mocked(module.get(HASH_SERVICE_PORT));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when is called, then it should', () => {
        let result: any;
        let { password: _, ...userWithoutPassword } = UserStub();
        beforeEach(async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            hashService.hash.mockResolvedValue('hashedPassword');
            userRepository.create.mockResolvedValue(UserStub());
            result = await useCase.execute(RegisterDtoStub());
        });
        test('call the user repository with the correct email', () => {
            expect(userRepository.findByEmail).toHaveBeenCalledWith(RegisterDtoStub().email);
        });
        test('call the hash service with the correct password', () => {
            expect(hashService.hash).toHaveBeenCalledWith(RegisterDtoStub().password);
        });
        test('call the user repository with the correct user', () => {
            expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                email: RegisterDtoStub().email,
                password: 'hashedPassword'
            }));
        });
        test('return the access token and user', async () => {
            expect(result).toEqual(userWithoutPassword);
        });
        test('do not return the password', async () => {
            expect(result).not.toHaveProperty('password');
        });
    });
    describe('when the user already exists, then it should', () => {
        let result: any;
        beforeEach(async () => {
            userRepository.findByEmail.mockResolvedValue(UserStub());
        });
        test('throw a UserAlreadyExistException', async () => {
            expect(useCase.execute(RegisterDtoStub())).rejects.toThrow(`Usuario con el email ${RegisterDtoStub().email} ya existe`);
        });
        test('not call the hash service', () => {
            expect(hashService.hash).not.toHaveBeenCalled();
        });
        test('not call the user repository create method', () => {
            expect(userRepository.create).not.toHaveBeenCalled();
        });
    });

});