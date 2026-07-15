import { MarginProfile } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class MarginProfileRepository extends BaseRepository {

    async findAll(): Promise<MarginProfile[]> {

        return this.prisma.marginProfile.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                displayOrder: "asc"
            }

        });

    }

    async findById(
        id: bigint
    ): Promise<MarginProfile | null> {

        return this.prisma.marginProfile.findUnique({

            where: {
                id
            }

        });

    }

    async findByUuid(
        uuid: string
    ): Promise<MarginProfile | null> {

        return this.prisma.marginProfile.findUnique({

            where: {
                uuid
            }

        });

    }

    async findByName(
        name: string
    ): Promise<MarginProfile | null> {

        return this.prisma.marginProfile.findUnique({

            where: {
                name
            }

        });

    }

    async create(data: {

        name: string;

        percentage: number;

        displayOrder: number;

    }): Promise<MarginProfile> {

        return this.prisma.marginProfile.create({

            data

        });

    }

}