import { PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { SetPartComponentProductsDto } from "./part-component-product.dto.js";

type PartComponentProductWithRelations =
    Prisma.PartComponentProductGetPayload<{
        include: {
            componentProduct: true;
        };
    }>;

export class PartComponentProductRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findByPart(
        partId: bigint
    ): Promise<PartComponentProductWithRelations[]> {

        return this.prisma.partComponentProduct.findMany({

            where: {
                partId
            },

            include: {
                componentProduct: true
            }

        });

    }

    async findPartsWithProducts(): Promise<{ partId: bigint }[]> {

        return this.prisma.partComponentProduct.findMany({

            distinct: ["partId"],

            select: {
                partId: true
            }

        });

    }

    async deleteByPart(
        partId: bigint
    ): Promise<void> {

        await this.prisma.partComponentProduct.deleteMany({

            where: {
                partId
            }

        });

    }

    async createMany(
        partId: bigint,
        data: SetPartComponentProductsDto
    ): Promise<PartComponentProductWithRelations[]> {

        if (data.products.length === 0) {
            return [];
        }

        await this.prisma.partComponentProduct.createMany({

            data: data.products.map(item => ({
                partId,
                componentProductId: BigInt(item.componentProductId),
                quantity: item.quantity
            }))

        });

        return this.findByPart(partId);

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): PartComponentProductRepository {

        return new PartComponentProductRepository(tx);

    }

}