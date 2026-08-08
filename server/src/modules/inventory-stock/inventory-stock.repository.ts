import { InventoryStock, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class InventoryStockRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<InventoryStock[]> {
        return this.prisma.inventoryStock.findMany({
            include: {
                product: true,
                store: true
            },
            orderBy: [
                {
                    storeId: "asc"
                },
                {
                    productId: "asc"
                }
            ]
        });
    }

    async findById(
        id: bigint
    ): Promise<InventoryStock | null> {
        return this.prisma.inventoryStock.findUnique({
            where: {
                id
            },
            include: {
                product: true,
                store: true
            }
        });
    }

    async findByProduct(
        productId: bigint
    ): Promise<InventoryStock[]> {
        return this.prisma.inventoryStock.findMany({
            where: {
                productId
            },
            include: {
                store: true
            }
        });
    }

    async findByStore(
        storeId: bigint
    ): Promise<InventoryStock[]> {
        return this.prisma.inventoryStock.findMany({
            where: {
                storeId
            },
            include: {
                product: true
            }
        });
    }

    async findByProductAndStore(
        productId: bigint,
        storeId: bigint
    ): Promise<InventoryStock | null> {
        return this.prisma.inventoryStock.findUnique({
            where: {
                productId_storeId: {
                    productId,
                    storeId
                }
            },
            include: {
                product: true,
                store: true
            }
        });
    }

    async findAllForStore(
        storeId: bigint
    ): Promise<InventoryStock[]> {
        return this.prisma.inventoryStock.findMany({
            include: {
                product: true,
                store: true
            },
            where: {
                OR: [
                    { storeId },
                    { store: { type: "MAIN_WAREHOUSE" } }
                ]
            },
            orderBy: [
                { storeId: "asc" },
                { productId: "asc" }
            ]
        });
    }

    async findLowStock(
        storeId?: bigint
    ): Promise<InventoryStock[]> {

        const stock = await this.prisma.inventoryStock.findMany({
            include: {
                product: true,
                store: true
            },
            where: storeId
                ? {
                    OR: [
                        { storeId },
                        { store: { type: "MAIN_WAREHOUSE" } }
                    ]
                }
                : undefined
        });

        return stock.filter(
            item => item.quantity.lte(item.product.minimumStock)
        );

    }

    async findMediumStock(
        storeId?: bigint
    ): Promise<InventoryStock[]> {

        const stock = await this.prisma.inventoryStock.findMany({
            include: {
                product: {
                    include: {
                        category: true
                    }
                },
                store: true
            },
            where: storeId
                ? {
                    OR: [
                        { storeId },
                        { store: { type: "MAIN_WAREHOUSE" } }
                    ]
                }
                : undefined
        });

        return stock.filter(item => {

            const minimum = item.product.minimumStock;
            const mediumThreshold = minimum.times(item.product.category.stockMultiplier);

            return item.quantity.gt(minimum) && item.quantity.lte(mediumThreshold);

        });

    }

    async create(
        productId: bigint,
        storeId: bigint,
        quantity: Prisma.Decimal
    ): Promise<InventoryStock> {
        return this.prisma.inventoryStock.create({
            data: {
                product: {
                    connect: {
                        id: productId
                    }
                },
                store: {
                    connect: {
                        id: storeId
                    }
                },
                quantity
            }
        });
    }

    async updateQuantity(
        id: bigint,
        quantity: Prisma.Decimal
    ): Promise<InventoryStock> {
        return this.prisma.inventoryStock.update({
            where: {
                id
            },
            data: {
                quantity
            }
        });
    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): InventoryStockRepository {

        return new InventoryStockRepository(tx);

    }
}