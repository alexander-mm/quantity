import { Client, Prisma } from "@prisma/client";

import { ConflictError } from "../../shared/errors/index.js";

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

}
