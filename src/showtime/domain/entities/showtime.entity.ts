import { randomUUID } from "crypto";
export interface ShowtimeProps {
    id?: string;
    movieId: string;
    room: string;
    dateTime: Date;
    price: number;
    totalSeats: number;
    availableSeats?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export class Showtime {
    private readonly id: string;
    private movieId: string;
    private room: string;
    private dateTime: Date;
    private price: number;
    private readonly totalSeats: number;
    private availableSeats: number;
    private readonly createdAt: Date;
    private updatedAt: Date;
    private deletedAt: Date | null;

    constructor(props: ShowtimeProps) {
        this.id = props.id ?? randomUUID();
        this.movieId = props.movieId;
        this.room = props.room;
        this.dateTime = props.dateTime;
        this.price = props.price;
        this.totalSeats = props.totalSeats;
        this.availableSeats = props.availableSeats ?? props.totalSeats;

        const now = new Date();
        this.createdAt = props.createdAt ?? now;
        this.updatedAt = props.updatedAt ?? now;
        this.deletedAt = props.deletedAt ?? null;

    }
    getId(): string | undefined {
        return this.id;
    }
    getMovieId(): string {
        return this.movieId;
    }
    getRoom(): string {
        return this.room;
    }
    getDateTime(): Date {
        return this.dateTime;
    }
    getPrice(): number {
        return this.price;
    }
    getTotalSeats(): number {
        return this.totalSeats;
    }
    getAvailableSeats(): number {
        return this.availableSeats;
    }
    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }
    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
    getDeletedAt(): Date | null {
        return this.deletedAt;
    }
}