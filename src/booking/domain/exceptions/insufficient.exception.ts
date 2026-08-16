import { HttpStatus } from "@nestjs/common";
import { DomainException } from "src/common/domain/exceptions";

export class InsufficientSeatsException extends DomainException {
    constructor(
        code: string = 'INSUFFICIENT_SEATS',
        message: string = 'No hay suficientes asientos disponibles para la reserva solicitada.',
        statusCode: number = HttpStatus.BAD_REQUEST
    ) {
        super(message, code, statusCode);
    }
}