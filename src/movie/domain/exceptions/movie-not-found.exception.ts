import { HttpStatus } from "@nestjs/common";
import { DomainException } from "src/common/domain/exceptions";

export class MovieNotFoundException extends DomainException {
    constructor(
        message: string = 'Película no encontrada',
        code: string = 'MOVIE_NOT_FOUND',
        statusCode: number = HttpStatus.NOT_FOUND,
    ) {
        super(message, code, statusCode);
    }
}