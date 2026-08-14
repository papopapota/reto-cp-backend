export interface TokenServicePort {
    generateToken(payload: { userId: string, rol: string }): Promise<string>;
    verifyToken(token: string): Promise<boolean>;
}

export const TOKEN_SERVICE_PORT = Symbol('TOKEN_SERVICE_PORT');
