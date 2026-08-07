import { Part, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class PartRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<Part[]> {

        return this.prisma.part.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                createdAt: "desc"
            }

        });

    }

    async findById(
        id: bigint
    ): Promise<Part | null> {

        return this.prisma.part.findUnique({

            where: {
                id
            }

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
