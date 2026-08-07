import { RawMaterial, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

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
