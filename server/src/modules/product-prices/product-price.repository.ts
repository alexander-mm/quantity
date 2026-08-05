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

    async findByProduct(
        productId: bigint
    ) {

        return this.prisma.productPrice.findMany({
            where: {
                productId,
                isActive: true,
                marginProfile: {
                    isActive: true
                }
            },
            orderBy: {
                marginProfile: {
                    displayOrder: "asc"
                }
            },
            include: {
                marginProfile: true
            }
        });
    }

    async createMany(
        data: Prisma.ProductPriceCreateManyInput[]
    ): Promise<void> {

        await this.prisma.productPrice.createMany({
            data
        });
    }

    async upsertForProductAndProfile(
        productId: bigint,
        marginProfileId: bigint,
        data: {
            price: Prisma.Decimal;
            priceCop?: Prisma.Decimal;
        }
    ): Promise<void> {

        await this.prisma.productPrice.upsert({
            where: {
                productId_marginProfileId: {
                    productId,
                    marginProfileId
                }
            },
            create: {
                productId,
                marginProfileId,
                price: data.price,
                priceCop: data.priceCop,
                isActive: true
            },
            update: {
                price: data.price,
                priceCop: data.priceCop
            }
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

    withTransaction(
        tx: Prisma.TransactionClient
    ): ProductPriceRepository {
        return new ProductPriceRepository(tx);
    }

}