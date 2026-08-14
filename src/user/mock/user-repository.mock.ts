import { UserRepositoryPort } from "../domain/ports";

export const UserRepositoryMock = (): jest.Mocked<UserRepositoryPort> => ({
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});