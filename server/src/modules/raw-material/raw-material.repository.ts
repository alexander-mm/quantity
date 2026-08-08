import { RawMaterial, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { RAW_MATERIAL_STOCK_MULTIPLIER } from "../../shared/constants/stock-multipliers.js";

export class RawMaterialRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<RawMaterial[]> {

        return this.prisma.rawMaterial.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                name: "asc"
            }

        });

    }

    async findById(
        id: bigint
    ): Promise<RawMaterial | null> {

        return this.prisma.rawMaterial.findUnique({

            where: {
                id
            }

        });

    }

    async findLowStock(): Promise<RawMaterial[]> {

        const rawMaterials = await this.prisma.rawMaterial.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                name: "asc"
            }

        });

        return rawMaterials.filter(
            item => item.minimumStock.gt(0) && item.quantity.lte(item.minimumStock)
        );

    }

    async findMediumStock(): Promise<RawMaterial[]> {

        const rawMaterials = await this.prisma.rawMaterial.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                name: "asc"
            }

        });

        return rawMaterials.filter(item => {

            if (!item.minimumStock.gt(0)) {
                return false;
            }

            const mediumThreshold = item.minimumStock.times(RAW_MATERIAL_STOCK_MULTIPLIER);

            return item.quantity.gt(item.minimumStock) && item.quantity.lte(mediumThreshold);

        });

    }

    async findByCode(
        code: string
    ): Promise<RawMaterial | null> {

        return this.prisma.rawMaterial.findUnique({

            where: {
                code
            }

        });

    }

    async create(
        data: Prisma.RawMaterialCreateInput
    ): Promise<RawMaterial> {

        return this.prisma.rawMaterial.create({

            data

        });

    }

    async update(
        id: bigint,
        data: Prisma.RawMaterialUpdateInput
    ): Promise<RawMaterial> {

        return this.prisma.rawMaterial.update({

            where: {
                id
            },

            data

        });

    }

    async delete(
        id: bigint
    ): Promise<RawMaterial> {

        return this.prisma.rawMaterial.update({

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
    ): Promise<RawMaterial> {

        return this.prisma.rawMaterial.update({

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
    ): Promise<RawMaterial> {

        return this.prisma.rawMaterial.update({

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
    ): RawMaterialRepository {

        return new RawMaterialRepository(tx);

    }

}
