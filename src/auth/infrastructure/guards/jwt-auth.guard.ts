import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { TOKEN_SERVICE_PORT, type TokenServicePort } from "src/auth/domain/ports";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    
    constructor(
        @Inject(TOKEN_SERVICE_PORT)
        private readonly tokenService: TokenServicePort,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.headers['authorization']?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token no proporcionado');
        }

        try {
            const payload = await this.tokenService.verifyToken(token);
            request['user'] = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token inválido');
        }
    }
}