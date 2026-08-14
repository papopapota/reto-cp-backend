import { User } from "../entities";

export interface UserRepositoryPort {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(id: string, user: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}

export const USER_REPOSITORY_PORT = Symbol("USER_REPOSITORY_PORT");