import {
    Prisma,
    PrismaClient
} from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class ProductPriceRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async createMany(
        data: Prisma.ProductPriceCreateManyInput[]
    ): Promise<void> {

        await this.prisma.productPrice.createMany({
            data
        });
    }

    async deleteByProductId(
        productId: bigint
    ): Promise<void> {

        await this.prisma.productPrice.deleteMany({
            where: {
                productId
            }
        });
    }
}