import { HashServicePort } from "src/auth/domain/ports";
import * as bcrypt from 'bcrypt';

export class BcryptHashServiceAdapter implements HashServicePort {
    private readonly SALT_ROUNDS = 10;
    hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }
    compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

}