import { HashServicePort } from "../domain/ports";

export const HashServiceMock = (): jest.Mocked<HashServicePort> => ({
    hash: jest.fn(),
    compare: jest.fn(),
});