import { PaginatedResultPort } from "src/common/application/ports";
import { Showtime } from "../entities";
import { Movie } from "src/movie/domain/entities";

export interface ShowtimeFilterOptions {
    movieId?: string;
    date?: string;
    minPrice?: number;
    maxPrice?: number;
    page: number;
    limit: number;
}
export interface ShowtimeWithMovie {
    showtime: Showtime;
    movie: Movie;
}

export interface ShowtimeRepositoryPort {
    create(showtime: Showtime): Promise<Showtime>;
    findById(id: string): Promise<Showtime | null>;
    /**
   * Obtiene un listado paginado de funciones aplicando filtros de catálogo (película, fecha, precios).
   *
   * @param filters - Criterios de filtrado y opciones de paginación.
   * @returns Resultado paginado con las funciones encontradas.
   */
    findAll(filters: ShowtimeFilterOptions): Promise<PaginatedResultPort<Showtime>>;
    findUpcomingByMovieId(movieId: string): Promise<Showtime[]>;
    /**
   * Consulta las funciones activas de una sala dentro de un rango temporal amplio,
   * incluyendo la información de la película asociada para validar solapamientos.
   *
   * @param room - Nombre o identificador de la sala de cine.
   * @param startTime - Hora de inicio de la nueva función proyectada.
   * @param endTime - Hora estimada de culminación de la nueva función.
   * @returns Lista de funciones cercanas junto con su respectiva entidad `Movie`.
   */
    findOverlappingShowtimes(
        room: string,
        startTime: Date,
        endTime: Date,
    ): Promise<ShowtimeWithMovie[]>;
    update(showtime: Showtime): Promise<void>;
    delete(id: string): Promise<void>;
}
export const SHOWTIME_REPOSITORY_PORT = Symbol('SHOWTIME_REPOSITORY_PORT');
