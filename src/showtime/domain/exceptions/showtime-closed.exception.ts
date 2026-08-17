import { HttpStatus } from "@nestjs/common";
import { DomainException } from "src/common/domain/exceptions";

export class ShowtimeClosedException extends DomainException {
    constructor(
        code: string = 'ShowtimeClosedException',
        message: string = 'Función cerrada',
        statusCode: number = HttpStatus.FORBIDDEN
    ) {
        super(message, code, statusCode);
    }
}