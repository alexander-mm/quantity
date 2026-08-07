import { Currency, Prisma, PrismaClient, ProductPriceEntry } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class ProductPriceEntryRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findByProduct(
        productId: bigint
    ): Promise<ProductPriceEntry[]> {
        return this.prisma.productPriceEntry.findMany({
            where: {
                productId
            },
            orderBy: [
                { currency: "asc" },
                { sequence: "asc" }
            ]
        });
    }

    async findMaxSequenceByCurrency(): Promise<{ currency: Currency; maxSequence: number }[]> {

        const result = await this.prisma.productPriceEntry.groupBy({
            by: ["currency"],
            _max: {
                sequence: true
            }
        });

        return result.map(row => ({
            currency: row.currency,
            maxSequence: row._max.sequence ?? 0
        }));

    }

    async deleteByProductId(
        productId: bigint
    ): Promise<void> {

        await this.prisma.productPriceEntry.deleteMany({
            where: {
                productId
            }
        });

    }

    async replaceForProduct(
        productId: bigint,
        entries: {
            currency: Currency;
            sequence: number;
            price: number | Prisma.Decimal;
        }[]
    ): Promise<void> {

        await this.prisma.productPriceEntry.deleteMany({
            where: {
                productId
            }
        });

        if (entries.length === 0) {
            return;
        }

        await this.prisma.productPriceEntry.createMany({
            data: entries.map(entry => ({
                productId,
                currency: entry.currency,
                sequence: entry.sequence,
                price: entry.price
            }))
        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): ProductPriceEntryRepository {
        return new ProductPriceEntryRepository(tx);
    }

}
