import { ShowtimeFilterOptions } from "../domain/ports";
const fomratedNow = new Date();
export const ShowtimeFilterStub = (
    movieId?: string,
    date?: string,
    minPrice?: number,
    maxPrice?: number
): ShowtimeFilterOptions => ({
    movieId: movieId ?? undefined,
    date: date ?? undefined,
    minPrice: minPrice ?? 1,
    maxPrice: maxPrice ?? 100,
    page: 1,
    limit: 10
})