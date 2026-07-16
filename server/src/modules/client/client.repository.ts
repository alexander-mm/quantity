import { Client, Prisma } from "@prisma/client";

import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class ClientRepository extends BaseRepository {

    async findAll(): Promise<Client[]> {

        return this.prisma.client.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                firstName: "asc"
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

}
