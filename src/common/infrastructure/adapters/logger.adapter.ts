import { Logger } from "@nestjs/common";
import { LoggerPort } from "src/common/application/ports";

export class LoggerAdapter implements LoggerPort {
    private dateTime: string = new Date().toISOString();
    private readonly logger: Logger;
    constructor(
        private context: string
    ) {
        this.logger = new Logger(context);
    }
    log(message: string): void {
        this.logger.log(message);
    }
    error(message: string, trace: string): void {
        this.logger.error(message, trace);
    }
    warn(message: string): void {
        this.logger.warn(message);
    }
}