import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../shared/errors/index.js";
import { InventoryAdjustmentRepository } from "./inventory-adjustment.repository.js";
import { CreateInventoryAdjustmentDto } from "./inventory-adjustment.dto.js";
import { InventoryMovementService } from "../inventory-movement/inventory-movement.service.js";
import { MovementTypeRepository } from "../movement-type/movement-type.repository.js";
import { ProductRepository } from "../product/product.repository.js";

export class InventoryAdjustmentService {

    private readonly repository = new InventoryAdjustmentRepository();
    private readonly movementService = new InventoryMovementService();
    private readonly movementTypeRepository = new MovementTypeRepository();
    private readonly productRepository = new ProductRepository();

    async findAll() {
        return this.repository.findAll();
    }

    async create(data: CreateInventoryAdjustmentDto) {

        const code =
            data.type === "IN"
                ? "ADJUSTMENT_IN"
                : "ADJUSTMENT_OUT";

        const movementType =
            await this.movementTypeRepository.findByCode(code);

        if (!movementType) {
            throw new NotFoundError(
                "El tipo de movimiento de ajuste no existe."
            );
        }

        const product =
            await this.productRepository.findById(
                BigInt(data.productId)
            );

        if (!product) {
            throw new NotFoundError(
                "El producto no existe."
            );
        }

        return this.movementService.create({
            movementTypeId: movementType.id,
            productId: BigInt(data.productId),
            storeId: BigInt(data.storeId),
            userId: BigInt(data.userId),
            quantity: new Prisma.Decimal(data.quantity),
            unitCost: product.costPrice,
            observations: data.reason,
            movementDate: new Date()
        });

    }

}
