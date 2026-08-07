import { Prisma } from "@prisma/client";

import { prisma } from "../../database/index.js";
import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { PartRepository } from "../part/part.repository.js";
import { PartRecipeRepository } from "../part-recipe/part-recipe.repository.js";
import { RawMaterialRepository } from "../raw-material/raw-material.repository.js";
import { PartMovementRepository } from "../part-movement/part-movement.repository.js";
import { RawMaterialMovementRepository } from "../raw-material-movement/raw-material-movement.repository.js";

import { PartCuttingOrderRepository } from "./part-cutting-order.repository.js";
import { CreatePartCuttingOrderDto, UpdatePartCuttingOrderDto, ConfirmPartCuttingOrderDto } from "./part-cutting-order.dto.js";

export class PartCuttingOrderService {

    private readonly repository = new PartCuttingOrderRepository();
    private readonly partRepository = new PartRepository();
    private readonly partRecipeRepository = new PartRecipeRepository();
    private readonly rawMaterialRepository = new RawMaterialRepository();
    private readonly partMovementRepository = new PartMovementRepository();
    private readonly rawMaterialMovementRepository = new RawMaterialMovementRepository();

    async findAll() {
        return this.repository.findAll();
    }

    async findById(id: string) {

        const order = await this.repository.findById(BigInt(id));

        if (!order) {
            throw new NotFoundError("Orden de corte no encontrada.");
        }

        return order;

    }

    private async resolveRecipe(partId: string) {

        const part = await this.partRepository.findById(BigInt(partId));

        if (!part) {
            throw new NotFoundError("Pieza no encontrada.");
        }

        const recipe = await this.partRecipeRepository.findByPart(BigInt(partId));

        if (!recipe) {
            throw new ValidationError("Esta pieza no tiene una receta de corte definida.");
        }

        return recipe;

    }

    async create(data: CreatePartCuttingOrderDto) {

        const existing = await this.repository.findByNumber(data.number);

        if (existing) {
            throw new ConflictError("Ya existe una orden de corte con ese número.");
        }

        const recipe = await this.resolveRecipe(data.partId);

        const expectedPieces = Number(recipe.piecesPerUnit) * data.rawMaterialQtyUsed;

        return this.repository.create(data, recipe.rawMaterialId, expectedPieces);

    }

    async update(id: string, data: UpdatePartCuttingOrderDto) {

        const order = await this.repository.findById(BigInt(id));

        if (!order) {
            throw new NotFoundError("Orden de corte no encontrada.");
        }

        if (order.status !== "DRAFT") {
            throw new ValidationError("Solo se pueden editar órdenes en borrador.");
        }

        const existing = await this.repository.findByNumber(data.number);

        if (existing && existing.id !== order.id) {
            throw new ConflictError("Ya existe una orden de corte con ese número.");
        }

        const recipe = await this.resolveRecipe(data.partId);

        const expectedPieces = Number(recipe.piecesPerUnit) * data.rawMaterialQtyUsed;

        return this.repository.update(order.id, data, recipe.rawMaterialId, expectedPieces);

    }

    async cancel(id: string) {

        const order = await this.repository.findById(BigInt(id));

        if (!order) {
            throw new NotFoundError("Orden de corte no encontrada.");
        }

        if (order.status !== "DRAFT") {
            throw new ValidationError("Solo se pueden eliminar órdenes en borrador.");
        }

        return this.repository.updateStatus(order.id, "CANCELLED");

    }

    async confirm(id: string, userId: string, data: ConfirmPartCuttingOrderDto) {

        const order = await this.repository.findById(BigInt(id));

        if (!order) {
            throw new NotFoundError("Orden de corte no encontrada.");
        }

        if (order.status !== "DRAFT") {
            throw new ValidationError("Esta orden de corte ya fue procesada.");
        }

        const rawMaterialAvailable = Number(order.rawMaterial.quantity);
        const rawMaterialRequired = Number(order.rawMaterialQtyUsed);

        if (rawMaterialAvailable < rawMaterialRequired) {
            throw new ValidationError(
                `Stock insuficiente de "${order.rawMaterial.name}": disponible ${rawMaterialAvailable}, requerido ${rawMaterialRequired}.`
            );
        }

        const goodPieces = data.goodPieces;
        const defectivePieces = data.defectivePieces ?? 0;

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const rawMaterialRepository = this.rawMaterialRepository.withTransaction(tx);
            const partRepository = this.partRepository.withTransaction(tx);
            const rawMaterialMovementRepository = this.rawMaterialMovementRepository.withTransaction(tx);
            const partMovementRepository = this.partMovementRepository.withTransaction(tx);

            await rawMaterialMovementRepository.create({
                number: `CORTE-${order.number}`,
                type: "OUT",
                userId,
                cuttingOrderId: order.id.toString(),
                movementDate: new Date(),
                observations: `Orden de corte ${order.number}: consumo de "${order.rawMaterial.name}"`,
                details: [{
                    rawMaterialId: order.rawMaterialId.toString(),
                    quantity: rawMaterialRequired
                }]
            });

            await rawMaterialRepository.decrementQuantity(
                order.rawMaterialId,
                new Prisma.Decimal(rawMaterialRequired)
            );

            if (goodPieces > 0) {

                await partMovementRepository.create({
                    number: `CORTE-${order.number}`,
                    type: "IN",
                    userId,
                    cuttingOrderId: order.id.toString(),
                    movementDate: new Date(),
                    observations: `Orden de corte ${order.number}: piezas producidas de "${order.part.name}"`,
                    details: [{
                        partId: order.partId.toString(),
                        quantity: goodPieces
                    }]
                });

                await partRepository.incrementQuantity(
                    order.partId,
                    new Prisma.Decimal(goodPieces)
                );

            }

            return repository.confirm(order.id, goodPieces, defectivePieces);

        });

    }

}
