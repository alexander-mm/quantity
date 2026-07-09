import { User } from "@prisma/client";

import { BaseRepository } from "./base/BaseRepository.js";

export class UserRepository extends BaseRepository {

    async findAll(): Promise<User[]> {

        return this.prisma.user.findMany({

            where: {
                isActive: true
            },

            include: {
                role: true,
                store: true
            },

            orderBy: {
                firstName: "asc"
            }

        });

    }

    async findById(id: bigint): Promise<User | null> {

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

    async findByUuid(uuid: string): Promise<User | null> {

        return this.prisma.user.findUnique({

            where: {
                uuid
            },

            include: {
                role: true,
                store: true
            }

        });

    }

    async findByUsername(username: string): Promise<User | null> {

        return this.prisma.user.findUnique({

            where: {
                username
            },

            include: {
                role: true,
                store: true
            }

        });

    }

}