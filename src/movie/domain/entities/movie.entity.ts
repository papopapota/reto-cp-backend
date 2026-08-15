import { MovieGenreEnum, MovieRatingEnum } from "../enums";
export interface MovieProps {
    id?: string;
    title: string;
    synopsis: string;
    duration: number;
    genre: MovieGenreEnum;
    rating: MovieRatingEnum;
    deletedAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export class Movie {
    private id?: string;
    private title: string;
    private synopsis: string;
    private duration: number;
    private genre: MovieGenreEnum;
    private rating: MovieRatingEnum;
    private deletedAt: Date | null;
    private createdAt?: Date;
    private updatedAt?: Date;
    constructor(
        props: MovieProps
    ) {
        this.id = props.id;
        this.title = props.title;
        this.synopsis = props.synopsis;
        this.duration = props.duration;
        this.genre = props.genre;
        this.rating = props.rating;
        this.deletedAt = props.deletedAt ?? null;
        const now = new Date();
        this.createdAt = props.createdAt ?? now;
        this.updatedAt = props.updatedAt ?? now;
    }

    create(
        props: Omit<MovieProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    ) {
        this.title = props.title;
        this.synopsis = props.synopsis;
        this.duration = props.duration;
        this.genre = props.genre;
        this.rating = props.rating;
        const now = new Date();
        this.createdAt = now;
        this.updatedAt = now;
    }

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    getId(): string | undefined {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(title: string): void {
        this.title = title;
    }

    getSynopsis(): string {
        return this.synopsis;
    }

    setSynopsis(synopsis: string): void {
        this.synopsis = synopsis;
    }

    getDuration(): number {
        return this.duration;
    }

    setDuration(duration: number): void {
        this.duration = duration;
    }

    getGenre(): MovieGenreEnum {
        return this.genre;
    }

    setGenre(genre: MovieGenreEnum): void {
        this.genre = genre;
    }

    setRating(rating: MovieRatingEnum): void {
        this.rating = rating;
    }

    getRating(): MovieRatingEnum {
        return this.rating;
    }

    getDeletedAt(): Date | null {
        return this.deletedAt;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}