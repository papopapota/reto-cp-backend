export interface HashServicePort {
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}

export const HASH_SERVICE_PORT = Symbol('HASH_SERVICE_PORT');