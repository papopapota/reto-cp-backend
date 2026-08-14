
export type UserProps = {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export class User {
    id?: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        props: UserProps
    ) {
        this.id = props.id;
        this.email = props.email;
        this.password = props.password;
        this.createdAt = props.createdAt ?? new Date();
        this.updatedAt = props.updatedAt ?? new Date();
    }

    static create(email: string, password: string): User {
        return new User({
            email,
            password,
        })
    }
    static recreate(props: Required<UserProps>): User {
        return new User(props);
    }
    getId(): string {
        return this.id!;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }



}