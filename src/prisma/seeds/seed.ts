import { MovieGenre, MovieRating, PrismaClient } from '@prisma/client';
import jsonMovies from './json/movies.json';
const prisma = new PrismaClient();
const movies = jsonMovies;

async function main() {
    let movieErrors: string[] = [];
    await prisma.movieModel.createMany({
        data: movies.map((movie) => ({
            title: movie.title,
            synopsis: movie.synopsis,
            duration: movie.duration,
            genre: movie.genre as MovieGenre,
            rating: movie.rating as MovieRating,
        }))
    }).catch((error) => {
        movieErrors.push(`movie Error creating movie: ${error.message} `);
    });

}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());