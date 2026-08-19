import { InventoryMovement, PrismaClient, Prisma } from "@prisma/client";
import { CreateInventoryMovementDto, UpdateInventoryMovementDto } from "./inventory-movement.dto.js";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";
import { safeUserSelect } from "../../shared/constants/safe-user-select.js";
type InventoryMovementWithRelations =
    Prisma.InventoryMovementGetPayload<{
        include: {
            movementType: true;
            product: true;
            store: true;
            user: { select: typeof safeUserSelect };
            client: true;
        };
    }>;
export class InventoryMovementRepository extends BaseRepository {



    constructor(
        prismaClient?: PrismaClient | Prisma.TransactionClient
    ) {
        super(prismaClient);
    }
    async findAll(): Promise<InventoryMovementWithRelations[]> {
        return this.prisma.inventoryMovement.findMany({
            where: {
                isActive: true
            },
            include: {
                movementType: true,
                product: true,
                store: true,
                user: { select: safeUserSelect },
                client: true
            },
            orderBy: {
                movementDate: "desc"
            }
        });
    }

    async findById(
        id: bigint
    ): Promise<InventoryMovementWithRelations | null> {
        return this.prisma.inventoryMovement.findUnique({
            where: {
                id
            },
            include: {
                movementType: true,
                product: true,
                store: true,
                user: { select: safeUserSelect },
                client: true
            }
        });
    }

    async findByUuid(
        uuid: string
    ): Promise<InventoryMovement | null> {
        return this.prisma.inventoryMovement.findUnique({
            where: {
                uuid
            }
        });
    }

    async findByProduct(
        productId: bigint
    ): Promise<InventoryMovement[]> {
        return this.prisma.inventoryMovement.findMany({
            where: {
                productId,
                isActive: true
            },
            orderBy: {
                movementDate: "desc"
            }
        });
    }

    async findByStore(
        storeId: bigint
    ): Promise<InventoryMovement[]> {
        return this.prisma.inventoryMovement.findMany({
            where: {
                storeId,
                isActive: true
            },
            orderBy: {
                movementDate: "desc"
            }
        });
    }

    async create(
        data: CreateInventoryMovementDto,
        status: "DRAFT" | "CONFIRMED" = "CONFIRMED"
    ): Promise<InventoryMovement> {
        return this.prisma.inventoryMovement.create({
            data: {
                movementType: {
                    connect: {
                        id: data.movementTypeId
                    }
                },
                product: {
                    connect: {
                        id: data.productId
                    }
                },
                store: {
                    connect: {
                        id: data.storeId
                    }
                },
                user: {
                    connect: {
                        id: data.userId
                    }
                },
                client: data.clientId
                    ? {
                        connect: {
                            id: data.clientId
                        }
                    }
                    : undefined,
                quantity: data.quantity,
                unitCost: data.unitCost,
                observations: data.observations,
                movementDate: data.movementDate,
                status
            }
        });
    }

    async update(
        id: bigint,
        data: UpdateInventoryMovementDto
    ): Promise<InventoryMovement> {
        return this.prisma.inventoryMovement.update({
            where: {
                id
            },
            data: {
                movementType: {
                    connect: {
                        id: data.movementTypeId
                    }
                },
                product: {
                    connect: {
                        id: data.productId
                    }
                },
                store: {
                    connect: {
                        id: data.storeId
                    }
                },
                user: {
                    connect: {
                        id: data.userId
                    }
                },
                client: data.clientId
                    ? {
                        connect: {
                            id: data.clientId
                        }
                    }
                    : {
                        disconnect: true
                    },
                quantity: data.quantity,
                unitCost: data.unitCost,
                observations: data.observations,
                movementDate: data.movementDate
            }
        });
    }

    async confirm(
        id: bigint
    ): Promise<InventoryMovement> {
        return this.prisma.inventoryMovement.update({
            where: {
                id
            },
            data: {
                status: "CONFIRMED"
            }
        });
    }

    async cancel(
        id: bigint
    ): Promise<InventoryMovement> {
        return this.prisma.inventoryMovement.update({
            where: {
                id
            },
            data: {
                status: "CANCELLED"
            }
        });
    }

    async getKardex(
        productId: bigint,
        storeId: bigint
    ): Promise<InventoryMovement[]> {
        return this.prisma.inventoryMovement.findMany({
            where: {
                productId,
                storeId,
                isActive: true,
                status: "CONFIRMED"
            },
            include: {
                movementType: true,
                user: { select: safeUserSelect },
                client: true
            },
            orderBy: {
                movementDate: "asc"
            }
        });
    }
    withTransaction(
        tx: Prisma.TransactionClient
    ): InventoryMovementRepository {

        return new InventoryMovementRepository(tx);

    }
}