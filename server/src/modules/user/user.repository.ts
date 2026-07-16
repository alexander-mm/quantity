import { User } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class UserRepository extends BaseRepository {

    async findAll(): Promise<User[]> {

        return this.prisma.user.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                username: "asc"
            }

        });

    }

    async findById(
        id: bigint
    ): Promise<User | null> {

        return this.prisma.user.findUnique({

            where: {
                id
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
    ): Promise<User | null> {

        return this.prisma.user.findUnique({

            where: {
                username
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

}