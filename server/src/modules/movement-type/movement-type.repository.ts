import { MovementType, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class MovementTypeRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<MovementType[]> {
        return this.prisma.movementType.findMany({
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
    ): Promise<MovementType | null> {
        return this.prisma.movementType.findUnique({
            where: {
                id
            }
        });
    }

    async findByCode(
        code: string
    ): Promise<MovementType | null> {
        return this.prisma.movementType.findUnique({
            where: {
                code
            }
        });
    }

    async findByName(
        name: string
    ): Promise<MovementType | null> {
        return this.prisma.movementType.findUnique({
            where: {
                name
            }
        });
    }

    async create(
        data: Prisma.MovementTypeCreateInput
    ): Promise<MovementType> {

        return this.prisma.movementType.create({
            data
        });
    }

    async update(
        id: bigint,
        data: Prisma.MovementTypeUpdateInput
    ): Promise<MovementType> {

        return this.prisma.movementType.update({

            where: {
                id
            },

            data

        });

    }
    async delete(
        id: bigint
    ): Promise<MovementType> {

        return this.prisma.movementType.delete({

            where: {
                id
            }

        });

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): MovementTypeRepository {

        return new MovementTypeRepository(tx);

    }
}
