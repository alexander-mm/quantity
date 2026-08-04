import { PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { SetProductComponentsDto } from "./product-component.dto.js";

type ProductComponentWithRelations =
    Prisma.ProductComponentGetPayload<{
        include: {
            componentProduct: true;
        };
    }>;

export class ProductComponentRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findByProduct(
        productId: bigint
    ): Promise<ProductComponentWithRelations[]> {

        return this.prisma.productComponent.findMany({

            where: {
                productId
            },

            include: {
                componentProduct: true
            }

        });

    }

    async findProductsWithRecipe(): Promise<{ productId: bigint }[]> {

        return this.prisma.productComponent.findMany({

            distinct: ["productId"],

            select: {
                productId: true
            }

        });

    }

    async deleteByProduct(
        productId: bigint
    ): Promise<void> {

        await this.prisma.productComponent.deleteMany({

            where: {
                productId
            }

        });

    }

    async createMany(
        productId: bigint,
        data: SetProductComponentsDto
    ): Promise<ProductComponentWithRelations[]> {

        if (data.components.length === 0) {
            return [];
        }

        await this.prisma.productComponent.createMany({

            data: data.components.map(item => ({
                productId,
                componentProductId: BigInt(item.componentProductId),
                quantity: item.quantity
            }))

        });

        return this.findByProduct(productId);

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): ProductComponentRepository {

        return new ProductComponentRepository(tx);

    }

}
