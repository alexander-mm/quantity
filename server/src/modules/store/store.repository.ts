import { Store, StoreType, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class StoreRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<Store[]> {

        return this.prisma.store.findMany({

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
    ): Promise<Store | null> {

        return this.prisma.store.findUnique({

            where: {
                id
            }

        });

    }

    async findByUuid(
        uuid: string
    ): Promise<Store | null> {

        return this.prisma.store.findUnique({

            where: {
                uuid
            }

        });

    }

    async findByCode(
        code: string
    ): Promise<Store | null> {

        return this.prisma.store.findUnique({

            where: {
                code
            }

        });

    }

    async findMainWarehouse(): Promise<Store | null> {

        return this.prisma.store.findFirst({

            where: {
                type: StoreType.MAIN_WAREHOUSE,
                isActive: true
            }

        });

    }

    async create(data: {

        code: string;

        name: string;

        type: StoreType;

        address?: string;

        city?: string;

        phone?: string;

        email?: string;

        manager?: string;

    }): Promise<Store> {

        return this.prisma.store.create({

            data

        });

    }

}