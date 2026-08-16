import { MovieGenre, MovieRating, PrismaClient } from '@prisma/client';
import jsonMovies from './json/movies.json';
import { randomUUID } from 'crypto';
const prisma = new PrismaClient();
const movies = jsonMovies;

const ROOMS = [
    { name: 'Sala 1 (2D)', capacity: 100, price: 22.0 },
    { name: 'Sala 2 (3D)', capacity: 120, price: 28.5 },
    { name: 'Sala 3 (IMAX)', capacity: 180, price: 42.0 },
    { name: 'Sala 4 (VIP)', capacity: 60, price: 55.0 },
];

async function main() {
    if (process.env.ENVIRONMENT !== "development") {
        return
    };
    await prisma.showtimeModel.deleteMany({});
    await prisma.movieModel.deleteMany({});

    await prisma.movieModel.createMany({
        data: movies.map((movie) => ({
            id: randomUUID(),
            title: movie.title,
            synopsis: movie.synopsis,
            duration: movie.duration,
            genre: movie.genre as MovieGenre,
            rating: movie.rating as MovieRating,
        }))
    })
    const createdMovies = await prisma.movieModel.findMany({
        select: { id: true, title: true },
    });
    const showtimesToInsert: {
        id: string;
        movieModelId: string;
        room: string;
        dateTime: Date;
        price: number;
        totalSeats: number;
        availableSeats: number;
    }[] = [];
    const now = new Date();
    createdMovies.forEach((movie, index) => {
        for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
            const roomConfig = ROOMS[(index + dayOffset) % ROOMS.length];

            const showtimeDate = new Date(now);
            showtimeDate.setDate(now.getDate() + dayOffset);

            // Asignar horarios escalonados (ej. 15:00, 18:30, 21:00)
            const hour = 15 + dayOffset * 3;
            showtimeDate.setHours(hour, 30, 0, 0);

            showtimesToInsert.push({
                id: randomUUID(),
                movieModelId: movie.id,
                room: roomConfig.name,
                dateTime: showtimeDate,
                price: roomConfig.price,
                totalSeats: roomConfig.capacity,
                availableSeats: roomConfig.capacity,
            });
        }
    });
    await prisma.showtimeModel.createMany({
        data: showtimesToInsert,
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());