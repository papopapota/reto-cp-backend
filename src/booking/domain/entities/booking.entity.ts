import { randomUUID } from "crypto";

export interface BookingProps {
    id?: string,
    showtimeId: string,
    customerName: string,
    customerEmail: string,
    seatsBooked: number,
    totalPrice: number,
    createdAt?: Date,
    updatedAt?: Date
}

export class Booking {
    private id: string;
    private showtimeId: string;
    private customerName: string;
    private customerEmail: string;
    private seatsBooked: number;
    private totalPrice: number;
    private createdAt: Date;
    private updatedAt: Date;
    constructor(
        props: BookingProps
    ) {
        this.id = props.id || randomUUID();
        this.showtimeId = props.showtimeId;
        this.customerName = props.customerName;
        this.customerEmail = props.customerEmail;
        this.seatsBooked = props.seatsBooked;
        this.totalPrice = props.totalPrice;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    getId(): string {
        return this.id;
    }

    getShowtimeId(): string {
        return this.showtimeId;
    }

    getCustomerName(): string {
        return this.customerName;
    }

    getCustomerEmail(): string {
        return this.customerEmail;
    }

    getSeatsBooked(): number {
        return this.seatsBooked;
    }

    getTotalPrice(): number {
        return this.totalPrice;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }
}