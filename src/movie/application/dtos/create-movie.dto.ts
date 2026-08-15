import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { MovieGenreEnum, MovieRatingEnum } from "src/movie/domain/enums";
export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title!: string;
    @IsNotEmpty()
    @IsString()
    synopsis!: string;
    @Type(() => Number)
    @IsInt()
    @Min(1, { message: 'duration debe ser mayor que 0' })
    duration!: number;
    @IsEnum(
        MovieGenreEnum,
        { message: `genre debe ser uno de los siguientes valores: ${Object.values(MovieGenreEnum).join(', ')}` }
    )
    genre!: MovieGenreEnum;
    @IsEnum(
        MovieRatingEnum,
        { message: `rating debe ser uno de los siguientes valores: ${Object.values(MovieRatingEnum).join(', ')}` }
    )
    rating!: MovieRatingEnum;
}