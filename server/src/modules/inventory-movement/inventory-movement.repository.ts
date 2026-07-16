import { InventoryMovement } from "@prisma/client";
import { CreateInventoryMovementDto } from "./inventory-movement.dto.js";
import { BaseRepository } from "../../repositories/base/BaseRepository.js";

export class InventoryMovementRepository extends BaseRepository {

    async findAll(): Promise<InventoryMovement[]> {

        return this.prisma.inventoryMovement.findMany({

            where: {
                isActive: true
            },

            orderBy: {
                movementDate: "desc"
            }

        });

    }

    async findById(
        id: bigint
    ): Promise<InventoryMovement | null> {

        return this.prisma.inventoryMovement.findUnique({

            where: {
                id
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
    data: CreateInventoryMovementDto
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

            movementDate: data.movementDate

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

            isActive: true

        },

        include: {

            movementType: true,

            user: true,

            client: true

        },

        orderBy: {

            movementDate: "asc"

        }

    });

}

}