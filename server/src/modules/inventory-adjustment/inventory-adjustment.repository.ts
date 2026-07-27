import { PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

type InventoryAdjustmentWithRelations =
    Prisma.InventoryMovementGetPayload<{
        include: {
            movementType: true;
            product: true;
            store: true;
            user: true;
        };
    }>;

export class InventoryAdjustmentRepository extends BaseRepository {

    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }

    async findAll(): Promise<InventoryAdjustmentWithRelations[]> {

        return this.prisma.inventoryMovement.findMany({

            where: {
                isActive: true,
                movementType: {
                    code: {
                        in: ["ADJUSTMENT_IN", "ADJUSTMENT_OUT"]
                    }
                }
            },

            include: {
                movementType: true,
                product: true,
                store: true,
                user: true
            },

            orderBy: {
                movementDate: "desc"
            }

        });

    }

}
