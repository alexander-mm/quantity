import { User, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class UserRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll() {

        return this.prisma.user.findMany({

            where: {
                isActive: true
            },

            include: {
                role: true,
                store: true
            },

            orderBy: {
                createdAt: "desc"
            }

        });

    }

    async findById(
        id: bigint
    ) {

        return this.prisma.user.findUnique({

            where: {
                id
            },

            include: {
                role: true,
                store: true
            }

        });

    }

    async findByUuid(
        uuid: string
    ): Promise<User | null> {

        return this.prisma.user.findUnique({

            where: {
                uuid
            }

        });

    }

    async findByUsername(
        username: string
    ) {

        return this.prisma.user.findUnique({

            where: {
                username
            },

            include: {
                role: true
            }

        });

    }

    async findByEmail(
        email: string
    ): Promise<User | null> {

        return this.prisma.user.findFirst({

            where: {
                email
            }

        });

    }

    async create(data: {

        username: string;

        password: string;

        firstName: string;

        lastName: string;

        email?: string;

        phone?: string;

        roleId: bigint;

        storeId: bigint;

    }): Promise<User> {

        return this.prisma.user.create({

            data

        });

    }

    async update(
        id: bigint,
        data: {

            username: string;

            password?: string;

            firstName: string;

            lastName: string;

            email?: string;

            phone?: string;

            roleId: bigint;

            storeId: bigint;

        }
    ): Promise<User> {

        return this.prisma.user.update({

            where: {
                id
            },

            data,

            include: {
                role: true,
                store: true
            }

        });

    }

    async delete(
        id: bigint
    ): Promise<User> {

        return this.prisma.user.update({

            where: {
                id
            },

            data: {
                isActive: false
            }

        });

    }

}