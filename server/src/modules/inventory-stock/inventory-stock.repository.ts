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

    async findLowStock(): Promise<InventoryStock[]> {

        return this.prisma.inventoryStock.findMany({

            include: {

                product: true,

                store: true

            },

            where: {

                quantity: {

                    lte: new Prisma.Decimal(0)

                }

            }

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

}