import { TokenServicePort } from "../domain/ports";

export const TokenServiceMock = (): TokenServicePort => ({
    generateToken: jest.fn().mockResolvedValue('token'),
    verifyToken: jest.fn().mockResolvedValue(true),
});