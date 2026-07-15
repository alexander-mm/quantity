import { UnitOfMeasure } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class UnitOfMeasureRepository extends BaseRepository {

    async findAll(): Promise<UnitOfMeasure[]> {

        return this.prisma.unitOfMeasure.findMany({

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
    ): Promise<UnitOfMeasure | null> {

        return this.prisma.unitOfMeasure.findUnique({

            where: {
                id
            }

        });

    }

    async findByUuid(
        uuid: string
    ): Promise<UnitOfMeasure | null> {

        return this.prisma.unitOfMeasure.findUnique({

            where: {
                uuid
            }

        });

    }

    async findByCode(
        code: string
    ): Promise<UnitOfMeasure | null> {

        return this.prisma.unitOfMeasure.findUnique({

            where: {
                code
            }

        });

    }

    async findByName(
        name: string
    ): Promise<UnitOfMeasure | null> {

        return this.prisma.unitOfMeasure.findUnique({

            where: {
                name
            }

        });

    }

    async create(data: {

        code: string;

        name: string;

        description?: string;

    }): Promise<UnitOfMeasure> {

        return this.prisma.unitOfMeasure.create({

            data

        });

    }

}