import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload, TokenServicePort } from "src/auth/domain/ports";

@Injectable()
export class JwtTokenServiceAdapter implements TokenServicePort {
    constructor(
        private readonly jwtService: JwtService
    ) { }
    async verifyToken(token: string): Promise<TokenPayload> {
        const payload = await this.jwtService.verifyAsync(token);
        if (!payload || !payload.userId || !payload.rol) {
            throw new UnauthorizedException('Token inválido');
        }
        return payload;
    }
    generateToken(payload: TokenPayload): Promise<string> {
        return this.jwtService.signAsync(payload);
    }
}
