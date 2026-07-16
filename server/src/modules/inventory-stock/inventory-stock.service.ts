import { InventoryStock, Prisma } from "@prisma/client";

import { ConflictError } from "../../shared/errors/index.js";

import { InventoryStockRepository } from "./inventory-stock.repository.js";

export class InventoryStockService {

    private readonly repository =
        new InventoryStockRepository();

    // ============================
    // CONSULTAS
    // ============================

    async findAll(): Promise<InventoryStock[]> {

        return this.repository.findAll();

    }

    async findById(
        id: string
    ): Promise<InventoryStock | null> {

        return this.repository.findById(
            BigInt(id)
        );

    }

    async findByProduct(
        productId: string
    ): Promise<InventoryStock[]> {

        return this.repository.findByProduct(
            BigInt(productId)
        );

    }

    async findByStore(
        storeId: string
    ): Promise<InventoryStock[]> {

        return this.repository.findByStore(
            BigInt(storeId)
        );

    }

    async findByProductAndStore(
        productId: string,
        storeId: string
    ): Promise<InventoryStock | null> {

        return this.repository.findByProductAndStore(

            BigInt(productId),

            BigInt(storeId)

        );

    }

    async findLowStock(): Promise<InventoryStock[]> {

        return this.repository.findLowStock();

    }

    // ============================
    // OPERACIONES DE STOCK
    // ============================

    async increaseStock(

        productId: bigint,

        storeId: bigint,

        quantity: Prisma.Decimal

    ): Promise<void> {

        let stock = await this.repository.findByProductAndStore(

            productId,

            storeId

        );

        if (!stock) {

            await this.repository.create(

                productId,

                storeId,

                quantity

            );

            return;

        }

        const newQuantity = stock.quantity.plus(quantity);

        await this.repository.updateQuantity(

            stock.id,

            newQuantity

        );

    }

    async decreaseStock(

        productId: bigint,

        storeId: bigint,

        quantity: Prisma.Decimal

    ): Promise<void> {

        const stock = await this.repository.findByProductAndStore(

            productId,

            storeId

        );

        if (!stock) {

            throw new ConflictError(

                "No existe inventario para este producto."

            );

        }

        const newQuantity = stock.quantity.minus(quantity);

        if (newQuantity.lessThan(0)) {

            throw new ConflictError(

                "Stock insuficiente."

            );

        }

        await this.repository.updateQuantity(

            stock.id,

            newQuantity

        );

    }

}