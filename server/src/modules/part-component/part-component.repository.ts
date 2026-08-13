import { PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { SetPartComponentsDto } from "./part-component.dto.js";

type PartComponentWithRelations =
    Prisma.PartComponentGetPayload<{
        include: {
            componentPart: true;
        };
    }>;

export class PartComponentRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findByPart(
        partId: bigint
    ): Promise<PartComponentWithRelations[]> {

        return this.prisma.partComponent.findMany({

            where: {
                partId
            },

            include: {
                componentPart: true
            }

        });

    }

    async findPartsWithRecipe(): Promise<{ partId: bigint }[]> {

        return this.prisma.partComponent.findMany({

            distinct: ["partId"],

            select: {
                partId: true
            }

        });

    }

    async deleteByPart(
        partId: bigint
    ): Promise<void> {

        await this.prisma.partComponent.deleteMany({

            where: {
                partId
            }

        });

    }

    async createMany(
        partId: bigint,
        data: SetPartComponentsDto
    ): Promise<PartComponentWithRelations[]> {

        if (data.components.length === 0) {
            return [];
        }

        await this.prisma.partComponent.createMany({

            data: data.components.map(item => ({
                partId,
                componentPartId: BigInt(item.componentPartId),
                quantity: item.quantity
            }))

        });

        return this.findByPart(partId);

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): PartComponentRepository {

        return new PartComponentRepository(tx);

    }

}