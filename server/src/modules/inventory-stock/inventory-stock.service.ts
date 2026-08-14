import { InventoryStock, Prisma } from "@prisma/client";
import { ConflictError, NotFoundError } from "../../shared/errors/index.js";
import {
    InventoryStockRepository,
    type InventoryStockWithProductAndStore,
    type InventoryStockWithProductCategoryAndStore,
    type InventoryStockWithStore
} from "./inventory-stock.repository.js";
import { prisma } from "../../database/index.js";

export class InventoryStockService {
    private repository: InventoryStockRepository;

    constructor(
        repository?: InventoryStockRepository
    ) {
        this.repository =
            repository ??
            new InventoryStockRepository(prisma);
    }
    // ============================
    // CONSULTAS
    // ============================
    async findAll(): Promise<InventoryStock[]> {
        return this.repository.findAll();
    }

    async findAllForStore(
        storeId: string
    ): Promise<InventoryStock[]> {
        return this.repository.findAllForStore(
            BigInt(storeId)
        );
    }

    async findById(
        id: string
    ): Promise<InventoryStock> {
        const stock =
            await this.repository.findById(
                BigInt(id)
            );
        if (!stock) {
            throw new NotFoundError(
                "Registro de inventario no encontrado."
            );
        }
        return stock;
    }

    async findByProduct(
        productId: string
    ): Promise<InventoryStockWithStore[]> {
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

    async findLowStock(
        storeId?: string
    ): Promise<InventoryStockWithProductAndStore[]> {
        return this.repository.findLowStock(
            storeId ? BigInt(storeId) : undefined
        );
    }

    async findMediumStock(
        storeId?: string
    ): Promise<InventoryStockWithProductCategoryAndStore[]> {
        return this.repository.findMediumStock(
            storeId ? BigInt(storeId) : undefined
        );
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
    withTransaction(
        tx: Prisma.TransactionClient
    ): InventoryStockService {

        return new InventoryStockService(
            new InventoryStockRepository(tx)
        );

    }
}