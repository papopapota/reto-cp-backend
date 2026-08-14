import { User } from "../domain/entities";
const fixedDate = new Date('2023-01-01T00:00:00.000Z');

export const UserStub = () => {
    return new User({
        id: '1',
        email: 'user@example.com',
        password: 'hashedPassword',
        createdAt: fixedDate,
        updatedAt: fixedDate,
    });
}