import { HttpStatus } from "@nestjs/common";

export class DomainException extends Error {
    constructor(
        public override message: string,
        public readonly code: string = 'DOMAIN_ERROR',
        public readonly statusCode: number = HttpStatus.BAD_REQUEST    
    ) {
        super(message);
    }
}