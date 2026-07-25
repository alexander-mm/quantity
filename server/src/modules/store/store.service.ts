import { Store, StoreType } from "@prisma/client";
import { ConflictError, NotFoundError } from "../../shared/errors/index.js";
import { StoreRepository } from "./store.repository.js";

export class StoreService {

    private readonly repository = new StoreRepository();

    async findAll(): Promise<Store[]> {
        return this.repository.findAll();
    }

    async findById(
        id: string
    ): Promise<Store> {

        const store =
            await this.repository.findById(
                BigInt(id)
            );
        if (!store) {
            throw new NotFoundError(
                "Sucursal o bodega no encontrada."
            );
        }
        return store;
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

    async update(
        id: string,
        data: {
            code: string;
            name: string;
            type: StoreType;
            address?: string;
            city?: string;
            phone?: string;
            email?: string;
            manager?: string;
        }
    ): Promise<Store> {
        const store =
            await this.repository.findById(
                BigInt(id)
            );
        if (!store) {
            throw new NotFoundError(
                "Sucursal o bodega no encontrada."
            );
        }
        const existingCode =
            await this.repository.findByCode(
                data.code
            );
        if (
            existingCode &&
            existingCode.id !== store.id
        ) {
            throw new ConflictError(
                "Ya existe una tienda con ese código."
            );
        }
        if (data.type === StoreType.MAIN_WAREHOUSE) {

            const mainWarehouse =
                await this.repository.findMainWarehouse();
            if (
                mainWarehouse &&
                mainWarehouse.id !== store.id
            ) {
                throw new ConflictError(
                    "Ya existe una bodega principal."
                );
            }
        }
        return this.repository.update(
            store.id,
            data
        );
    }

    async delete(
        id: string
    ): Promise<Store> {
        const store =
            await this.repository.findById(
                BigInt(id)
            );
        if (!store) {
            throw new NotFoundError(
                "Sucursal o bodega no encontrada."
            );
        }
        return this.repository.delete(
            store.id
        );
    }
}