import { Role } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class RoleRepository extends BaseRepository {

    async findAll(): Promise<Role[]> {

        return this.prisma.role.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                name: "asc"
            }

        });

    }

    async findById(
        id: bigint
    ): Promise<Role | null> {

        return this.prisma.role.findUnique({

            where: {
                id
            }

        });

    }

    async findByUuid(
        uuid: string
    ): Promise<Role | null> {

        return this.prisma.role.findUnique({

            where: {
                uuid
            }

        });

    }

    async findByName(
        name: string
    ): Promise<Role | null> {

        return this.prisma.role.findUnique({

            where: {
                name
            }

        });

    }

    async create(data: {

        name: string;

        description?: string;

    }): Promise<Role> {

        return this.prisma.role.create({

            data

        });

    }

}