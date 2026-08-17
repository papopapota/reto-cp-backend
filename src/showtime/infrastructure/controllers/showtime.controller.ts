import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';
import { CreateShowtimeDto, QueryShowtimeDto } from 'src/showtime/application/dtos';
import { CreateShowtimeUseCase, GetAllShowtimeUseCase } from 'src/showtime/application/use-cases';
/**
 * Controlador HTTP para gestionar la cartelera y programación de funciones de cine.
 */
@Controller('showtimes')
export class ShowtimeController {
    constructor(
        private readonly createShowtimeUseCase: CreateShowtimeUseCase,
        private readonly getAllShowtimeUseCase: GetAllShowtimeUseCase
    ) { }
    /**
   * Consulta las funciones disponibles con filtros por película, fecha y rango de precios.
   *
   * @param query - Criterios de búsqueda y paginación.
   * @returns Listado paginado de funciones ordenadas cronológicamente.
   */
    @HttpCode(HttpStatus.OK)
    @Get()
    getShowtimes(
        @Query() query: QueryShowtimeDto
    ) {
        return this.getAllShowtimeUseCase.execute(query);
    }
    /**
       * Programa una nueva función en la cartelera de una sala.
       *
       * @param createShowtimeDto - Datos de la función (movieId, sala, fecha/hora, precio, total de asientos).
       * @returns La entidad de la función programada.
       */
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    createShowtime(
        @Body() dto: CreateShowtimeDto
    ) {
        return this.createShowtimeUseCase.execute(dto);
    }
}
