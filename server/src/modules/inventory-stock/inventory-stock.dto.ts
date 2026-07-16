
import { Prisma } from "@prisma/client";

export interface UpdateInventoryStockDto {

    productId: bigint;

    storeId: bigint;

    quantity: Prisma.Decimal;

}