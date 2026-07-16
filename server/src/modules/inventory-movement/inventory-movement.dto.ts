import { Prisma } from "@prisma/client";

export interface CreateInventoryMovementDto {

    movementTypeId: bigint;

    productId: bigint;

    storeId: bigint;

    userId: bigint;

    clientId?: bigint;

    quantity: Prisma.Decimal;

    unitCost: Prisma.Decimal;

    observations?: string;

    movementDate: Date;

}