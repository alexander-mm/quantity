import { Client, PrismaClient, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class ClientRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<Client[]> {

        return this.prisma.client.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                id: "desc"
            }

        });

    }

    async findById(
        id: bigint
    ): Promise<Client | null> {

        return this.prisma.client.findUnique({

            where: {
                id
            }

        });

    }

    async findByDocument(
        document: string
    ): Promise<Client | null> {

        return this.prisma.client.findUnique({

            where: {
                document
            }

        });

    }

    async create(
        data: Prisma.ClientCreateInput
    ): Promise<Client> {

        return this.prisma.client.create({

            data

        });

    }

    async update(
        id: bigint,
        data: Prisma.ClientUpdateInput
    ): Promise<Client> {

        return this.prisma.client.update({

            where: {
                id
            },

            data

        });

    }

    async delete(
        id: bigint
    ): Promise<Client> {

        return this.prisma.client.update({

            where: {
                id
            },

            data: {
                isActive: false
            }

        });

    }

}
