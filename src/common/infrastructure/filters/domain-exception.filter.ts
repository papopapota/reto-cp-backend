import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { UserAlreadyExistException } from "src/auth/domain/exceptions";
import { DomainException } from "src/common/domain/exceptions";

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(DomainExceptionFilter.name);

    catch(exception: DomainException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let statusCode = exception.statusCode || HttpStatus.BAD_REQUEST;
        this.logger.warn(`[${exception.code}] ${exception.message}`);

        response.status(statusCode).json({
            statusCode,
            code: exception.code || 'DOMAIN_ERROR',
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}