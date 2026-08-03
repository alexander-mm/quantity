import { Client, Prisma } from "@prisma/client";

import { ConflictError, NotFoundError } from "../../shared/errors/index.js";

import { ClientRepository } from "./client.repository.js";

export class ClientService {

    private readonly repository = new ClientRepository();

    async findAll(): Promise<Client[]> {

        return this.repository.findAll();

    }

    async findById(
        id: string
    ): Promise<Client | null> {

        return this.repository.findById(
            BigInt(id)
        );

    }

    async create(
        data: Prisma.ClientCreateInput
    ): Promise<Client> {

        const clientExists =
            await this.repository.findByDocument(
                data.document
            );

        if (clientExists) {

            throw new ConflictError(
                "Ya existe un cliente con ese documento."
            );

        }

        return this.repository.create(data);

    }

    async update(
        id: string,
        data: Prisma.ClientUpdateInput
    ): Promise<Client> {

        const client =
            await this.repository.findById(
                BigInt(id)
            );

        if (!client) {

            throw new NotFoundError(
                "Cliente no encontrado."
            );

        }

        if (typeof data.document === "string") {

            const existing =
                await this.repository.findByDocument(
                    data.document
                );

            if (
                existing &&
                existing.id !== client.id
            ) {

                throw new ConflictError(
                    "Ya existe un cliente con ese documento."
                );

            }

        }

        return this.repository.update(
            BigInt(id),
            data
        );

    }

    async delete(
        id: string
    ): Promise<Client> {

        const client =
            await this.repository.findById(
                BigInt(id)
            );

        if (!client) {

            throw new NotFoundError(
                "Cliente no encontrado."
            );

        }

        return this.repository.delete(
            BigInt(id)
        );

    }

}
