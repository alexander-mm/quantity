import { Prisma } from "@prisma/client";
import { prisma } from "../../database/index.js";
import { DamagedPartRepository, type DamagedPartWithRelations } from "./damaged-part.repository.js";

export class DamagedPartService {

    private repository: DamagedPartRepository;

    constructor(
        repository?: DamagedPartRepository
    ) {
        this.repository =
            repository ??
            new DamagedPartRepository(prisma);
    }

    async findAll(): Promise<DamagedPartWithRelations[]> {
        return this.repository.findAll();
    }

    async increase(
        partId: bigint,
        quantity: Prisma.Decimal
    ): Promise<void> {

        const damagedPart = await this.repository.findByPart(partId);

        if (!damagedPart) {
            await this.repository.create(partId, quantity);
            return;
        }

        await this.repository.updateQuantity(
            damagedPart.id,
            damagedPart.quantity.plus(quantity)
        );

    }

    withTransaction(
        tx: Prisma.TransactionClient
    ): DamagedPartService {
        return new DamagedPartService(
            new DamagedPartRepository(tx)
        );
    }
}
