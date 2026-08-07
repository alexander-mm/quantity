import { Brand, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class BrandRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<Brand[]> {

        return this.prisma.brand.findMany({
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
    ): Promise<Brand | null> {

        return this.prisma.brand.findUnique({
            where: {
                id
            }
        });
    }

    async findByUuid(
        uuid: string
    ): Promise<Brand | null> {

        return this.prisma.brand.findUnique({
            where: {
                uuid
            }
        });
    }

    async findByName(
        name: string
    ): Promise<Brand | null> {

        return this.prisma.brand.findUnique({

            where: {
                name
            }
        });
    }

    async create(data: {
        name: string;
        description?: string;
    }): Promise<Brand> {

        return this.prisma.brand.create({
            data
        });
    }

    async delete(
        id: bigint
    ): Promise<Brand> {

        return this.prisma.brand.update({
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
    ): BrandRepository {

        return new BrandRepository(tx);

    }
}

