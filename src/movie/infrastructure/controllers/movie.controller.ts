import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';
import { CreateMovieDto, GetMoviesQueryDto, UpdateMovieDto } from 'src/movie/application/dtos';
import { CreateMovieUseCase, GetAllMoviesUseCase, GetMovieWithShowtimeUseCase, DeleteMovieUseCase, UpdateMovieUseCase } from 'src/movie/application/use-cases';
/**
 * Controlador HTTP encargado de exponer los endpoints para la gestión de películas.
 * Maneja la validación de parámetros de ruta y delega la ejecución a los casos de uso.
 */
@Controller('movies')
export class MovieController {
    constructor(
        private readonly getMoviesUseCase: GetAllMoviesUseCase,
        private readonly getMovieWithShowtimeUseCase: GetMovieWithShowtimeUseCase,
        private readonly createMovieUseCase: CreateMovieUseCase,
        private readonly updateMovieUseCase: UpdateMovieUseCase,
        private readonly deleteMovieUseCase: DeleteMovieUseCase
    ) { }
    @HttpCode(HttpStatus.OK)
    @Get()
    /**
       * Obtiene el listado paginado y filtrado de películas activas.
       *
       * @param queryDto - Parámetros de consulta (género, rating, búsqueda por título, paginación).
       * @returns Objeto con la lista de películas y metadatos de paginación.
       */
    getMovies(
        @Query() query: GetMoviesQueryDto
    ) {
        return this.getMoviesUseCase.execute({
            page: query.page ?? 1,
            limit: query.limit ?? 10,
            genre: query.genre,
            rating: query.rating,
            sortBy: query.sortBy ?? 'createdAt',
            sortOrder: query.sortOrder ?? 'desc',
        });
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    /**
     * Obtiene una película por su ID.
     *
     * @param id - El ID de la película a obtener.
     * @returns La entidad de la película encontrada.
     */
    getMovieById(
        @Param('id', ParseUUIDPipe) id: string
    ) {
        return this.getMovieWithShowtimeUseCase.execute(id);
    }

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @Post()
    /**
   * Registra una nueva película en el catálogo.
   *
   * @param createMovieDto - Datos requeridos para crear la película (título, sinopsis, duración, género, rating).
   * @returns La entidad de la película creada.
   */
    createMovie(
        @Body() dto: CreateMovieDto
    ) {
        return this.createMovieUseCase.execute(dto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    /**
   * Actualiza parcialmente la información de una película existente.
   *
   * @param id - Identificador único de la película en formato UUID v4.
   * @param updateMovieDto - Campos a actualizar de la película.
   * @returns La entidad de la película con los datos modificados.
   * @throws {MovieNotFoundException} Si la película a modificar no existe.
   */
    updateMovie(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateMovieDto
    ) {
        return this.updateMovieUseCase.execute(id, dto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    /**
   * Realiza la eliminación lógica (soft delete) de una película del catálogo.
   *
   * @param id - Identificador único de la película en formato UUID v4.
   * @returns Respuesta sin contenido indicando éxito en la operación.
   * @throws {MovieNotFoundException} Si la película no existe.
   */
    deleteMovie(
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.deleteMovieUseCase.execute(id);
    }
}
