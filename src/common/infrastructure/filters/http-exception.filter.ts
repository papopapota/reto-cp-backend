import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let message = exception.message;
        let code = 'HTTP_ERROR';
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const resObj = exceptionResponse as Record<string, any>;
            message = resObj.message || message;
            code = resObj.error ? resObj.error.toUpperCase().replace(/\s+/g, '_') : code;
        }
        this.logger.warn(`[${statusCode}] ${Array.isArray(message) ? message.join(', ') : message}`);

        response.status(statusCode).json({
            statusCode,
            code: code || 'HTTP_ERROR',
            message: message,
            timestamp: new Date().toISOString(),
        });
    }
}