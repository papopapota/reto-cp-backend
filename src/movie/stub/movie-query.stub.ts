import { MovieQuery } from "../domain/ports";

export const MovieQueryStub = (): MovieQuery => ({
    limit: 10,
    page: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc'
})