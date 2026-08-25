import { Prisma } from "@prisma/client";
import { prisma } from "../../database/index.js";
import { DamagedStockRepository, type DamagedStockWithProductAndStore } from "./damaged-stock.repository.js";

export class DamagedStockService {

    private repository: DamagedStockRepository;

    constructor(
        repository?: DamagedStockRepository
    ) {
        this.repository =
            repository ??
            new DamagedStockRepository(prisma);
    }

    async findAll(): Promise<DamagedStockWithProductAndStore[]> {
        return this.repository.findAll();
    }

    async increase(
        productId: bigint,
        storeId: bigint,
        quantity: Prisma.Decimal
    ): Promise<void> {

        const stock = await this.repository.findByProductAndStore(
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

        await this.repository.updateQuantity(
            stock.id,
            stock.quantity.plus(quantity)
        );

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): DamagedStockService {
        return new DamagedStockService(
            new DamagedStockRepository(tx)
        );
    }
}
