import { Sale } from "@prisma/client";
import { SaleRepository } from "./sale.repository.js";
import { CreateSaleDto, UpdateSaleDto } from "./sale.dto.js";
import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { prisma } from "../../database/index.js";
import { InventoryMovementService } from "../inventory-movement/inventory-movement.service.js";
import { MovementTypeRepository } from "../movement-type/movement-type.repository.js";

export class SaleService {

    private readonly repository = new SaleRepository();
    private readonly inventoryMovementService =
        new InventoryMovementService();

    private readonly movementTypeRepository =
        new MovementTypeRepository();

    async findAll(): Promise<Sale[]> {
        return this.repository.findAll();
    }

    async findById(
        id: string
    ): Promise<Sale> {

        const sale = await this.repository.findById(
            BigInt(id)
        );

        if (!sale) {
            throw new NotFoundError(
                "Venta no encontrada."
            );
        }

        return sale;

    }

    async create(
        data: CreateSaleDto
    ): Promise<Sale> {

        const existing = await this.repository.findByNumber(
            data.number
        );

        if (existing) {
            throw new ConflictError(
                "Ya existe una venta con ese número."
            );
        }

        return this.repository.create(data);

    }

    async update(
        id: string,
        data: UpdateSaleDto
    ): Promise<Sale> {

        const sale = await this.repository.findById(
            BigInt(id)
        );

        if (!sale) {
            throw new NotFoundError(
                "Venta no encontrada."
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
                "Ya existe una venta con ese número."
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

        const sale = await this.repository.findById(
            BigInt(id)
        );

        if (!sale) {
            throw new NotFoundError(
                "Venta no encontrada."
            );
        }

        if (sale.status !== "DRAFT") {
            throw new ValidationError(
                "Solo se pueden cancelar ventas en borrador."
            );
        }

        await this.repository.delete(
            BigInt(id)
        );

    }

    async confirm(
        id: string
    ): Promise<Sale> {

        return prisma.$transaction(async (tx) => {

            const saleRepository =
                this.repository.withTransaction(tx);

            const sale =
                await saleRepository.findById(
                    BigInt(id)
                );

            if (!sale) {
                throw new NotFoundError(
                    "Venta no encontrada."
                );
            }

            if (sale.status !== "DRAFT") {
                throw new ValidationError(
                    "La venta ya fue confirmada."
                );
            }

            if (sale.details.length === 0) {
                throw new ValidationError(
                    "La venta no tiene productos."
                );
            }

            const movementType =
                await this.movementTypeRepository.findByCode(
                    "SALE"
                );

            if (!movementType) {
                throw new NotFoundError(
                    "No existe el tipo de movimiento VENTA."
                );
            }

            const movementService =
                this.inventoryMovementService.withTransaction(
                    tx
                );

            for (const detail of sale.details) {

                await movementService.createWithTransaction({

                    movementTypeId: movementType.id,

                    productId: detail.productId,

                    storeId: sale.storeId,

                    userId: sale.userId,

                    clientId: sale.clientId,

                    quantity: detail.quantity,

                    unitCost: detail.unitPrice,

                    observations: sale.observations ?? undefined,

                    movementDate: sale.saleDate

                });

            }

            await saleRepository.confirm(
                sale.id
            );

            const confirmedSale =
                await saleRepository.findById(
                    sale.id
                );

            if (!confirmedSale) {
                throw new NotFoundError(
                    "Venta no encontrada."
                );
            }

            return confirmedSale;

        });

    }

}
