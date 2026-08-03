import { Purchase } from "@prisma/client";
import { PurchaseRepository } from "./purchase.repository.js";
import { CreatePurchaseDto, UpdatePurchaseDto } from "./purchase.dto.js";
import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { prisma } from "../../database/index.js";
import { InventoryMovementService } from "../inventory-movement/inventory-movement.service.js";
import { MovementTypeRepository } from "../movement-type/movement-type.repository.js";

export class PurchaseService {

    private readonly repository = new PurchaseRepository();
    private readonly inventoryMovementService =
        new InventoryMovementService();

    private readonly movementTypeRepository =
        new MovementTypeRepository();

    async findAll(): Promise<Purchase[]> {
        return this.repository.findAll();
    }

    async findById(
        id: string
    ): Promise<Purchase> {

        const purchase = await this.repository.findById(
            BigInt(id)
        );

        if (!purchase) {
            throw new NotFoundError(
                "Compra no encontrada."
            );
        }

        return purchase;

    }

    async create(
        data: CreatePurchaseDto
    ): Promise<Purchase> {

        const existing = await this.repository.findByNumber(
            data.number
        );

        if (existing) {
            throw new ConflictError(
                "Ya existe una compra con ese número."
            );
        }

        return this.repository.create(data);

    }

    async update(
        id: string,
        data: UpdatePurchaseDto
    ): Promise<Purchase> {

        const purchase = await this.repository.findById(
            BigInt(id)
        );

        if (!purchase) {
            throw new NotFoundError(
                "Compra no encontrada."
            );
        }

        const existing = await this.repository.findByNumber(
            data.number
        );

        if (
            existing &&
            existing.id !== BigInt(id)
        ) {
            throw new ConflictError(
                "Ya existe una compra con ese número."
            );
        }

        return this.repository.update(
            BigInt(id),
            data
        );

    }


    async delete(
        id: string
    ): Promise<void> {

        const purchase = await this.repository.findById(
            BigInt(id)
        );

        if (!purchase) {
            throw new NotFoundError(
                "Compra no encontrada."
            );
        }

        if (purchase.status !== "DRAFT") {
            throw new ValidationError(
                "Solo se pueden cancelar compras en borrador."
            );
        }

        await this.repository.delete(
            BigInt(id)
        );

    }

    async confirm(
        id: string
    ): Promise<Purchase> {

        return prisma.$transaction(async (tx) => {

            const purchaseRepository =
                this.repository.withTransaction(tx);

            const purchase =
                await purchaseRepository.findById(
                    BigInt(id)
                );

            if (!purchase) {
                throw new NotFoundError(
                    "Compra no encontrada."
                );
            }

            if (purchase.status !== "DRAFT") {
                throw new ValidationError(
                    "La compra ya fue confirmada."
                );
            }

            if (purchase.details.length === 0) {
                throw new ValidationError(
                    "La compra no tiene productos."
                );
            }

            const movementType =
                await this.movementTypeRepository.findByCode(
                    "PURCHASE"
                );

            if (!movementType) {
                throw new NotFoundError(
                    "No existe el tipo de movimiento COMPRA."
                );
            }

            const movementService =
                this.inventoryMovementService.withTransaction(
                    tx
                );

            for (const detail of purchase.details) {

                await movementService.createWithTransaction({

                    movementTypeId: movementType.id,

                    productId: detail.productId,

                    storeId: purchase.storeId,

                    userId: purchase.userId,

                    quantity: detail.quantity,

                    unitCost: detail.unitCost,

                    observations: purchase.observations ?? undefined,

                    movementDate: purchase.purchaseDate

                });

            }

            await purchaseRepository.confirm(
                purchase.id
            );

            const confirmedPurchase =
                await purchaseRepository.findById(
                    purchase.id
                );

            if (!confirmedPurchase) {
                throw new NotFoundError(
                    "Compra no encontrada."
                );
            }

            return confirmedPurchase;

        });

    }

}