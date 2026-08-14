import { HttpStatus } from "@nestjs/common";
import { DomainException } from "src/common/domain/exceptions";

export class UserAlreadyExistException extends DomainException {
    constructor(
        email: string,
    ) {
        super(
            `Usuario con el email ${email} ya existe`,
            'USER_ALREADY_EXIST',
            HttpStatus.CONFLICT
        );
    }
}