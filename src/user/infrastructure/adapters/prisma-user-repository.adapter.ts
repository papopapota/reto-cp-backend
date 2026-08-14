import { UserModel } from "@prisma/client";
import { User } from "src/user/domain/entities";
import { UserRepositoryPort } from "src/user/domain/ports";
import { PrismaService } from "src/prisma/prisma.service";
import { UserMapper } from "../mappers";
import { Injectable } from "@nestjs/common";
@Injectable()
export class PrismaUserRepositoryAdapter implements UserRepositoryPort {
    constructor(
        
        private readonly prisma: PrismaService
    ) {}
    async findById(id: string): Promise<User | null> {
        return this.prisma.userModel.findUnique({
            where: {
                id: id
            }
        }).then((prismaUser) => {
            if (!prismaUser) {
                return null;
            }
            return UserMapper.toDomain(prismaUser);
        });
    }
    async findByEmail(email: string): Promise<User | null> {
        const prismaUser = await this.prisma.userModel.findUnique({
            where: {
                email: email
            }
        });
        if (!prismaUser) {
            return null;
        }
        return UserMapper.toDomain(prismaUser);
    }

    async create(user: User): Promise<User> {
        const userPersistence = UserMapper.toPersistence(user);
        const prismaUser = await this.prisma.userModel.create({
            data: {
                email: userPersistence.email,
                password: userPersistence.password,
                createdAt: userPersistence.createdAt,
                updatedAt: userPersistence.updatedAt
            }
        });
        return UserMapper.toDomain(prismaUser);
    }
    async update(id: string, user: Partial<User>): Promise<User | null> {
        const updateData: Partial<UserModel> = UserMapper.toPersistence(user as User);
        const prismaUser = await this.prisma.userModel.update({
            where: {
                id: id
            },
            data: updateData
        });
        if (!prismaUser) {
            return null;
        }
        return UserMapper.toDomain(prismaUser);
    }
    async delete(id: string): Promise<boolean> {
        const prismaUser = await this.prisma.userModel.delete({
            where: {
                id: id
            }
        });
        return !!prismaUser;
    }
}