import { Part, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { PART_STOCK_MULTIPLIER } from "../../shared/constants/stock-multipliers.js";

export type PartWithCategory =
    Prisma.PartGetPayload<{
        include: {
            category: true;
        };
    }>;

export class PartRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<PartWithCategory[]> {

        return this.prisma.part.findMany({

            where: {
                isActive: true
            },

            include: {
                category: true
            },

            orderBy: {
                createdAt: "desc"
            }

        });

    }

    async findById(
        id: bigint
    ): Promise<PartWithCategory | null> {

        return this.prisma.part.findUnique({

            where: {
                id
            },

            include: {
                category: true
            }

        });

    }

    async findLowStock(): Promise<Part[]> {

        const parts = await this.prisma.part.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                name: "asc"
            }

        });

        return parts.filter(
            item => item.minimumStock.gt(0) && item.quantity.lte(item.minimumStock)
        );

    }

    async findMediumStock(): Promise<Part[]> {

        const parts = await this.prisma.part.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                name: "asc"
            }

        });

        return parts.filter(item => {

            if (!item.minimumStock.gt(0)) {
                return false;
            }

            const mediumThreshold = item.minimumStock.times(PART_STOCK_MULTIPLIER);

            return item.quantity.gt(item.minimumStock) && item.quantity.lte(mediumThreshold);

        });

    }

    async findByCode(
        code: string
    ): Promise<Part | null> {

        return this.prisma.part.findUnique({

            where: {
                code
            }

        });

    }

    async create(
        data: Prisma.PartCreateInput
    ): Promise<Part> {

        return this.prisma.part.create({

            data

        });

    }

    async update(
        id: bigint,
        data: Prisma.PartUpdateInput
    ): Promise<Part> {

        return this.prisma.part.update({

            where: {
                id
            },

            data

        });

    }

    async delete(
        id: bigint
    ): Promise<Part> {

        return this.prisma.part.update({

            where: {
                id
            },

            data: {
                isActive: false
            }

        });

    }

    async incrementQuantity(
        id: bigint,
        quantity: Prisma.Decimal
    ): Promise<Part> {

        return this.prisma.part.update({

            where: {
                id
            },

            data: {
                quantity: {
                    increment: quantity
                }
            }

        });

    }

    async decrementQuantity(
        id: bigint,
        quantity: Prisma.Decimal
    ): Promise<Part> {

        return this.prisma.part.update({

            where: {
                id
            },

            data: {
                quantity: {
                    decrement: quantity
                }
            }

        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): PartRepository {

        return new PartRepository(tx);

    }

}
