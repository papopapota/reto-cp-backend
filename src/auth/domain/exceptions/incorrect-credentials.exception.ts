import { HttpStatus } from "@nestjs/common";
import { DomainException } from "src/common/domain/exceptions";

export class IncorrectCredentialsException extends DomainException {
    constructor(
    ) {
        super(
            `Credenciales incorrectas`,
            'INCORRECT_CREDENTIALS',
            HttpStatus.UNAUTHORIZED
        );
    }
}