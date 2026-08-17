import { HttpStatus } from "@nestjs/common";
import { DomainException } from "src/common/domain/exceptions";

export class BookingNotFoundException extends DomainException {
    constructor(
        message: string = "Reserva no encontrada",
        code: string = "BOOKING_NOT_FOUND",
        statusCode: number = HttpStatus.NOT_FOUND
    ) {
        super(message, code, statusCode);
    }
}