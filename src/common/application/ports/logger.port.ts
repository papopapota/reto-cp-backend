export interface LoggerPort {
    log(message: string): void;
    error(message: string, trace: string): void;
    warn(message: string): void;
}

export const LOGGER_PORT = Symbol('LoggerPort');
export const PRISMA_LOGGER_PORT = Symbol('PRISMA_LOGGER_PORT');