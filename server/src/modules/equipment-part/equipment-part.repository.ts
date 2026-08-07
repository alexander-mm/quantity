import { PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { SetEquipmentPartsDto } from "./equipment-part.dto.js";

type EquipmentPartWithRelations =
    Prisma.EquipmentPartGetPayload<{
        include: {
            part: true;
        };
    }>;

export class EquipmentPartRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findByProduct(
        productId: bigint
    ): Promise<EquipmentPartWithRelations[]> {

        return this.prisma.equipmentPart.findMany({

            where: {
                productId
            },

            include: {
                part: true
            }

        });

    }

    async findProductsWithParts(): Promise<{ productId: bigint }[]> {

        return this.prisma.equipmentPart.findMany({

            distinct: ["productId"],

            select: {
                productId: true
            }

        });

    }

    async deleteByProduct(
        productId: bigint
    ): Promise<void> {

        await this.prisma.equipmentPart.deleteMany({

            where: {
                productId
            }

        });

    }

    async createMany(
        productId: bigint,
        data: SetEquipmentPartsDto
    ): Promise<EquipmentPartWithRelations[]> {

        if (data.parts.length === 0) {
            return [];
        }

        await this.prisma.equipmentPart.createMany({

            data: data.parts.map(item => ({
                productId,
                partId: BigInt(item.partId),
                quantity: item.quantity
            }))

        });

        return this.findByProduct(productId);

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): EquipmentPartRepository {

        return new EquipmentPartRepository(tx);

    }

}
