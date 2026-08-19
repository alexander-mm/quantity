import { PartCategory, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class PartCategoryRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<PartCategory[]> {

        return this.prisma.partCategory.findMany({
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
    ): Promise<PartCategory | null> {

        return this.prisma.partCategory.findUnique({
            where: {
                id
            }
        });
    }

    async findByUuid(
        uuid: string
    ): Promise<PartCategory | null> {

        return this.prisma.partCategory.findUnique({
            where: {
                uuid
            }
        });
    }

    async findByName(
        name: string
    ): Promise<PartCategory | null> {

        return this.prisma.partCategory.findUnique({

            where: {
                name
            }
        });
    }

    async create(data: {
        name: string;
        description?: string;
    }): Promise<PartCategory> {

        return this.prisma.partCategory.create({
            data
        });
    }

    async delete(
        id: bigint
    ): Promise<PartCategory> {

        return this.prisma.partCategory.update({
            where: {
                id
            },
            data: {
                isActive: false
            }
        });
    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): PartCategoryRepository {

        return new PartCategoryRepository(tx);

    }
}
