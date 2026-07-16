import { Store, StoreType } from "@prisma/client";

import {
    ConflictError
} from "../../shared/errors/index.js";

import { StoreRepository } from "./store.repository.js";

export class StoreService {

    private readonly repository = new StoreRepository();

    async findAll(): Promise<Store[]> {

        return this.repository.findAll();

    }

    async findById(
        id: string
    ): Promise<Store | null> {

        return this.repository.findById(
            BigInt(id)
        );

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

        const existingCode =
            await this.repository.findByCode(
                data.code
            );

        if (existingCode) {

            throw new ConflictError(
                "Ya existe una tienda con ese código."
            );

        }

        if (data.type === StoreType.MAIN_WAREHOUSE) {

            const mainWarehouse =
                await this.repository.findMainWarehouse();

            if (mainWarehouse) {

                throw new ConflictError(
                    "Ya existe una bodega principal."
                );

            }

        }

        return this.repository.create(data);

    }

}