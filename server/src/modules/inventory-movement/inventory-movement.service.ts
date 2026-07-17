import { InventoryMovement } from "@prisma/client";
import { CreateInventoryMovementDto } from "./inventory-movement.dto.js";
import {
    NotFoundError,
    ValidationError
} from "../../shared/errors/index.js";

import { InventoryMovementRepository } from "./inventory-movement.repository.js";

import { ProductRepository } from "../product/product.repository.js";
import { StoreRepository } from "../store/store.repository.js";
import { UserRepository } from "../user/user.repository.js";
import { ClientRepository } from "../client/client.repository.js";
import { MovementTypeRepository } from "../movement-type/movement-type.repository.js";
import { InventoryStockService } from "../inventory-stock/inventory-stock.service.js";

export class InventoryMovementService {

    private readonly repository = new InventoryMovementRepository();

    private readonly productRepository = new ProductRepository();

    private readonly storeRepository = new StoreRepository();

    private readonly userRepository = new UserRepository();

    private readonly clientRepository = new ClientRepository();

    private readonly movementTypeRepository = new MovementTypeRepository();

    private readonly inventoryStockService = new InventoryStockService();

    async findAll(): Promise<InventoryMovement[]> {

        return this.repository.findAll();

    }

    async findById(
        id: string
    ): Promise<InventoryMovement | null> {

        return this.repository.findById(
            BigInt(id)
        );

    }

    async findByProduct(
        productId: string
    ): Promise<InventoryMovement[]> {

        return this.repository.findByProduct(
            BigInt(productId)
        );

    }

    async findByStore(
        storeId: string
    ): Promise<InventoryMovement[]> {

        return this.repository.findByStore(
            BigInt(storeId)
        );

    }

    async create(
        data: CreateInventoryMovementDto
    ): Promise<InventoryMovement> {

        // Producto
        const product = await this.productRepository.findById(
            BigInt(data.productId)
        );

        if (!product) {

            throw new NotFoundError(
                "El producto no existe."
            );

        }

        // Tienda
        const store = await this.storeRepository.findById(
            BigInt(data.storeId)
        );

        if (!store) {

            throw new NotFoundError(
                "La tienda no existe."
            );

        }

        // Usuario
        const user = await this.userRepository.findById(
            BigInt(data.userId)
        );

        if (!user) {

            throw new NotFoundError(
                "El usuario no existe."
            );

        }

        // Tipo de movimiento
        const movementType = await this.movementTypeRepository.findById(
            BigInt(data.movementTypeId)
        );

        if (!movementType) {

            throw new NotFoundError(
                "El tipo de movimiento no existe."
            );

        }

        // Cliente (opcional)
        if (data.clientId) {

            const client = await this.clientRepository.findById(
                BigInt(data.clientId)
            );

            if (!client) {

                throw new NotFoundError(
                    "El cliente no existe."
                );

            }

        }

        // Cantidad
        if (Number(data.quantity) <= 0) {

            throw new ValidationError(
                "La cantidad debe ser mayor que cero."
            );

        }

        // Costo unitario
        if (Number(data.unitCost) < 0) {

            throw new ValidationError(
                "El costo unitario no puede ser negativo."
            );

        }

        if (movementType.affectsStock) {

            switch (movementType.stockOperation) {

                case "IN":

                    await this.inventoryStockService.increaseStock(

                        data.productId,

                        data.storeId,

                        data.quantity

                    );

                    break;

                case "OUT":

                    await this.inventoryStockService.decreaseStock(

                        data.productId,

                        data.storeId,

                        data.quantity

                    );

                    break;

                case "NONE":

                    break;

            }

        }

        const movement = await this.repository.create(data);

        return movement;

    }

    async getKardex(
        productId: string,
        storeId: string
    ): Promise<InventoryMovement[]> {

        return this.repository.getKardex(

            BigInt(productId),

            BigInt(storeId)

        );

    }

}

