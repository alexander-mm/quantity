import { DamagedStock, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export type DamagedStockWithProductAndStore =
    Prisma.DamagedStockGetPayload<{
        include: { product: true; store: true };
    }>;

export class DamagedStockRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<DamagedStockWithProductAndStore[]> {
        return this.prisma.damagedStock.findMany({
            include: {
                product: true,
                store: true
            },
            orderBy: [
                { storeId: "asc" },
                { productId: "asc" }
            ]
        });
    }

    async findByProductAndStore(
        productId: bigint,
        storeId: bigint
    ): Promise<DamagedStock | null> {
        return this.prisma.damagedStock.findUnique({
            where: {
                productId_storeId: {
                    productId,
                    storeId
                }
            }
        });
    }

    async create(
        productId: bigint,
        storeId: bigint,
        quantity: Prisma.Decimal
    ): Promise<DamagedStock> {
        return this.prisma.damagedStock.create({
            data: {
                product: { connect: { id: productId } },
                store: { connect: { id: storeId } },
                quantity
            }
        });
    }

    async updateQuantity(
        id: bigint,
        quantity: Prisma.Decimal
    ): Promise<DamagedStock> {
        return this.prisma.damagedStock.update({
            where: { id },
            data: { quantity }
        });
    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): DamagedStockRepository {
        return new DamagedStockRepository(tx);
    }
}
