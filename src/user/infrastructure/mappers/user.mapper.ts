import { UserModel } from "@prisma/client";
import { User } from "src/user/domain/entities";

export class UserMapper {
    public static toDomain(prismaUser: UserModel): User {
        return User.recreate({
            id: prismaUser.id,
            email: prismaUser.email,
            password: prismaUser.password,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt
        });
    };

    public static toPersistence(user: User): UserModel {
        return {
            id: user.getId(),
            email: user.getEmail(),
            password: user.getPassword(),
            createdAt: user.getCreatedAt(),
            updatedAt: user.getUpdatedAt()
        } as UserModel;
    }
}