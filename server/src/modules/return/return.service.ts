import { Prisma } from "@prisma/client";
import { prisma } from "../../database/index.js";
import { NotFoundError, ValidationError, ConflictError } from "../../shared/errors/index.js";
import { ReturnRepository } from "./return.repository.js";
import { CreateReturnDto, ResolveReturnDto } from "./return.dto.js";
import { SaleRepository } from "../sale/sale.repository.js";
import { MovementTypeRepository } from "../movement-type/movement-type.repository.js";
import { InventoryMovementService } from "../inventory-movement/inventory-movement.service.js";

export class ReturnService {

    private readonly repository = new ReturnRepository();
    private readonly saleRepository = new SaleRepository();
    private readonly movementTypeRepository = new MovementTypeRepository();
    private readonly inventoryMovementService = new InventoryMovementService();

    async findAll() {
        return this.repository.findAll();
    }

    async findById(id: string) {
        const item = await this.repository.findById(BigInt(id));
        if (!item) {
            throw new NotFoundError("Devolución no encontrada.");
        }
        return item;
    }

    async create(data: CreateReturnDto) {

        const existing = await this.repository.findByNumber(data.number);

        if (existing) {
            throw new ConflictError("Ya existe una devolución con ese número.");
        }

        let fallbackUnitPrice: Prisma.Decimal | null = null;

        if (data.saleId) {

            const sale = await this.saleRepository.findById(BigInt(data.saleId));

            if (!sale) {
                throw new NotFoundError("La venta indicada no existe.");
            }

            if (sale.status !== "CONFIRMED") {
                throw new ValidationError("Solo se puede hacer una devolución de una venta confirmada.");
            }

            if (data.saleDetailId) {

                const detail = sale.details.find(d => d.id.toString() === data.saleDetailId);

                if (!detail) {
                    throw new ValidationError("La línea indicada no pertenece a esa venta.");
                }

                if (detail.productId.toString() !== data.productId) {
                    throw new ValidationError("El producto no coincide con la línea de venta seleccionada.");
                }

                fallbackUnitPrice = detail.unitPrice;

            }

        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);

            const returnRecord = await repository.create({
                number: data.number,
                sale: data.saleId ? { connect: { id: BigInt(data.saleId) } } : undefined,
                saleDetail: data.saleDetailId ? { connect: { id: BigInt(data.saleDetailId) } } : undefined,
                product: { connect: { id: BigInt(data.productId) } },
                store: { connect: { id: BigInt(data.storeId) } },
                quantity: data.quantity,
                reason: data.reason,
                notes: data.notes,
                returnDate: data.returnDate,
                user: { connect: { id: BigInt(data.userId) } },
                status: data.disposition ? "RESOLVED" : "PENDING_REVIEW",
                disposition: data.disposition,
                resolvedAt: data.disposition ? new Date() : undefined,
                resolver: data.disposition ? { connect: { id: BigInt(data.userId) } } : undefined
            });

            if (data.disposition === "RESTOCK") {
                await this.applyRestock(
                    tx,
                    data.productId,
                    data.storeId,
                    data.quantity,
                    data.userId,
                    data.number,
                    fallbackUnitPrice
                );
            }

            return returnRecord;

        });

    }

    async resolve(id: string, data: ResolveReturnDto) {

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const returnRecord = await repository.findById(BigInt(id));

            if (!returnRecord) {
                throw new NotFoundError("Devolución no encontrada.");
            }

            if (returnRecord.status !== "PENDING_REVIEW") {
                throw new ValidationError("Esta devolución ya fue resuelta.");
            }

            const resolved = await repository.resolve(BigInt(id), {
                disposition: data.disposition,
                resolvedBy: BigInt(data.userId)
            });

            if (data.disposition === "RESTOCK") {

                const fallbackUnitPrice = returnRecord.saleDetail?.unitPrice ?? null;

                await this.applyRestock(
                    tx,
                    returnRecord.productId.toString(),
                    returnRecord.storeId.toString(),
                    Number(returnRecord.quantity),
                    data.userId,
                    returnRecord.number,
                    fallbackUnitPrice
                );

            }

            // Nota: si el destino es DAMAGED, en esta fase solo queda registrado
            // el destino — la Fase 2 (Stock Dañado) es la que realmente mueve
            // la cantidad a esa tabla aparte.

            return resolved;

        });

    }

    private async applyRestock(
        tx: Prisma.TransactionClient,
        productId: string,
        storeId: string,
        quantity: number,
        userId: string,
        returnNumber: string,
        fallbackUnitPrice: Prisma.Decimal | null
    ) {

        const movementType = await this.movementTypeRepository.findByCode("RETURN_IN");

        if (!movementType) {
            throw new NotFoundError(
                'No existe el tipo de movimiento RETURN_IN. Corre "npx tsx scripts/seed-movement-types.ts".'
            );
        }

        const movementService = this.inventoryMovementService.withTransaction(tx);

        await movementService.createWithTransaction({
            movementTypeId: movementType.id,
            productId: BigInt(productId),
            storeId: BigInt(storeId),
            userId: BigInt(userId),
            quantity: new Prisma.Decimal(quantity),
            unitCost: fallbackUnitPrice ?? new Prisma.Decimal(0),
            observations: `Devolución ${returnNumber}`,
            movementDate: new Date()
        });

    }

}
