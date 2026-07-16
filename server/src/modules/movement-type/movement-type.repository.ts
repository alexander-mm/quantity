import { MovementType, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class MovementTypeRepository extends BaseRepository {

    async findAll(): Promise<MovementType[]> {

        return this.prisma.movementType.findMany({

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
    ): Promise<MovementType | null> {

        return this.prisma.movementType.findUnique({

            where: {
                id
            }

        });

    }

    async findByCode(
        code: string
    ): Promise<MovementType | null> {

        return this.prisma.movementType.findUnique({

            where: {
                code
            }

        });

    }

    async findByName(
        name: string
    ): Promise<MovementType | null> {

        return this.prisma.movementType.findUnique({

            where: {
                name
            }

        });

    }

    async create(
        data: Prisma.MovementTypeCreateInput
    ): Promise<MovementType> {

        return this.prisma.movementType.create({

            data

        });

    }

}
