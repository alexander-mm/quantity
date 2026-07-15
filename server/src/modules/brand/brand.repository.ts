import { Brand } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class BrandRepository extends BaseRepository {

    async findAll(): Promise<Brand[]> {

        return this.prisma.brand.findMany({

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
    ): Promise<Brand | null> {

        return this.prisma.brand.findUnique({

            where: {
                id
            }

        });

    }

    async findByUuid(
        uuid: string
    ): Promise<Brand | null> {

        return this.prisma.brand.findUnique({

            where: {
                uuid
            }

        });

    }

    async findByName(
        name: string
    ): Promise<Brand | null> {

        return this.prisma.brand.findUnique({

            where: {
                name
            }

        });

    }

    async create(data: {

        name: string;

        description?: string;

    }): Promise<Brand> {

        return this.prisma.brand.create({

            data

        });

    }

}