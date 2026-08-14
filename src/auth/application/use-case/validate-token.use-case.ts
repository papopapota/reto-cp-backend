import { Inject, Injectable } from "@nestjs/common";
import { TOKEN_SERVICE_PORT, TokenPayload, type TokenServicePort } from "src/auth/domain/ports";

@Injectable()
export class ValidateTokenUseCase {
    constructor(
        @Inject(TOKEN_SERVICE_PORT)
        private readonly tokenService: TokenServicePort,
    ) { }

    async execute(token: string): Promise<TokenPayload> {
        const payload = await this.tokenService.verifyToken(token);
        if (!payload || !payload.userId || !payload.rol) {
            throw new Error('Token inválido');
        }
        return payload;
    }
}