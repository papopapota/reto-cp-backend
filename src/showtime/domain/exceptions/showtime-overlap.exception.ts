import { HttpStatus } from "@nestjs/common";
import { DomainException } from "src/common/domain/exceptions";

export class ShowtimeOverlapException extends DomainException {
  constructor(
    message: string = 'Función superpuesta detectada',
    code: string = 'SHOWTIME_OVERLAP',
    statusCode: number = HttpStatus.CONFLICT
  ) {
    super(message, code, statusCode);
  }
}