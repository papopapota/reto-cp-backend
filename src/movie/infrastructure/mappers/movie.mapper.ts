import { MovieGenre, MovieModel, MovieRating } from "@prisma/client";
import { Movie } from "src/movie/domain/entities";
import { MovieGenreEnum, MovieRatingEnum } from "src/movie/domain/enums";

export class MovieMapper {
    static toDomain(prismaMovie: MovieModel): Movie {
        return new Movie(
            {
                id: prismaMovie.id,
                title: prismaMovie.title,
                synopsis: prismaMovie.synopsis,
                duration: prismaMovie.duration,
                genre: MovieGenreEnum[prismaMovie.genre as keyof typeof MovieGenreEnum],
                rating: MovieRatingEnum[prismaMovie.rating as keyof typeof MovieRatingEnum],
                deletedAt: prismaMovie.deletedAt,
                createdAt: prismaMovie.createdAt,
                updatedAt: prismaMovie.updatedAt
            }
        );
    }

    static toPersistence(movie: Movie): MovieModel {
        return {
            id: movie.getId()!,
            title: movie.getTitle(),
            synopsis: movie.getSynopsis(),
            duration: movie.getDuration(),
            genre: MovieGenre[movie.getGenre() as keyof typeof MovieGenre],
            rating: MovieRating[movie.getRating() as keyof typeof MovieRating],
            deletedAt: movie.getDeletedAt(),
            createdAt: movie.getCreatedAt()!,
            updatedAt: movie.getUpdatedAt()!
        };
    }
}