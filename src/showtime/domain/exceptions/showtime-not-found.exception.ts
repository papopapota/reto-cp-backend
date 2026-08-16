import { HttpStatus } from "@nestjs/common";
import { DomainException } from "src/common/domain/exceptions";

export class ShowtimeNotFoundException extends DomainException {
    constructor(
        code: string = 'ShowtimeNotFoundException',
        message: string = 'Función no encontrada',
        statusCode: number = HttpStatus.NOT_FOUND
    ) {
        super(message, code, statusCode);
    }
}