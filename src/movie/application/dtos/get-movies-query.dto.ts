import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MovieGenreEnum } from '../../domain/enums/movie-genre.enum';
import { MovieRatingEnum } from '../../domain/enums/movie-rating.enum';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum MovieSortBy {
  TITLE = 'title',
  DURATION = 'duration',
  CREATED_AT = 'createdAt',
}

export class GetMoviesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(MovieGenreEnum)
  genre?: MovieGenreEnum;

  @IsOptional()
  @IsEnum(MovieRatingEnum)
  rating?: MovieRatingEnum;

  @IsOptional()
  @IsEnum(MovieSortBy)
  sortBy?: MovieSortBy = MovieSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}