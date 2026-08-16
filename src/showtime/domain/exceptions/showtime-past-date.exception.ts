import { HttpStatus } from "@nestjs/common";
import { DomainException } from "src/common/domain/exceptions";

export class ShowtimePastDateException extends DomainException {
  constructor(
    override message: string = 'No se pueden crear funciones con fechas pasadas.',
    override code: string = 'SHOWTIME_PAST_DATE',
    override statusCode: number = HttpStatus.BAD_REQUEST
  ) {
    super(message, code, statusCode);
  }
}