import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenServicePort } from "src/auth/domain/ports";

@Injectable()
export class JwtTokenServiceAdapter implements TokenServicePort {
    constructor(
        private readonly jwtService: JwtService
    ){}
    generateToken(payload: { userId: string; rol: string; }): Promise<string> {
        return this.jwtService.signAsync(payload);
    }
}
