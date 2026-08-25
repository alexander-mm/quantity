import { Prisma } from "@prisma/client";
import { prisma } from "../../database/index.js";
import { NotFoundError, ValidationError, ConflictError } from "../../shared/errors/index.js";
import { ReturnRepository } from "./return.repository.js";
import { CreateReturnDto, ResolveReturnDto } from "./return.dto.js";
import { SaleRepository } from "../sale/sale.repository.js";
import { MovementTypeRepository } from "../movement-type/movement-type.repository.js";
import { InventoryMovementService } from "../inventory-movement/inventory-movement.service.js";
import { DamagedStockService } from "../damaged-stock/damaged-stock.service.js";
import { DamagedPartService } from "../damaged-part/damaged-part.service.js";
import { ProductAssemblyRepository, type ProductAssemblyWithRelations } from "../product-assembly/product-assembly.repository.js";
import { ProductComponentRepository } from "../product-component/product-component.repository.js";
import { EquipmentPartRepository } from "../equipment-part/equipment-part.repository.js";
import { PartRepository } from "../part/part.repository.js";
import { PartMovementRepository } from "../part-movement/part-movement.repository.js";

export class ReturnService {

    private readonly repository = new ReturnRepository();
    private readonly saleRepository = new SaleRepository();
    private readonly movementTypeRepository = new MovementTypeRepository();
    private readonly inventoryMovementService = new InventoryMovementService();
    private readonly damagedStockService = new DamagedStockService();
    private readonly damagedPartService = new DamagedPartService();
    private readonly productAssemblyRepository = new ProductAssemblyRepository();
    private readonly productComponentRepository = new ProductComponentRepository();
    private readonly equipmentPartRepository = new EquipmentPartRepository();
    private readonly partRepository = new PartRepository();
    private readonly partMovementRepository = new PartMovementRepository();

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

        if (!data.productId && !data.partId) {
            throw new ValidationError("Debes indicar el producto o la pieza a devolver.");
        }

        if (data.clientUuid) {

            const existingByClientUuid = await this.repository.findByClientUuid(data.clientUuid);

            if (existingByClientUuid) {
                return existingByClientUuid;
            }

        }

        const existing = await this.repository.findByNumber(data.number);

        if (existing) {
            throw new ConflictError("Ya existe una devolución con ese número.");
        }

        let fallbackUnitPrice: Prisma.Decimal | null = null;

        // Determina si el ítem elegido ya salió de vendible en algún punto
        // anterior (venta, o consumo dentro de una orden de ensamblaje) o si
        // sigue sentado en inventario y por lo tanto hay que descontarlo ahora
        // mismo al registrar la devolución.
        let needsDecrementNow = !data.saleId && !data.assemblyId;

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

                if (data.productId && detail.productId.toString() === data.productId) {

                    // Se devuelve el producto vendido tal cual (caso normal, o el
                    // "producto armado" completo de un kit).
                    fallbackUnitPrice = detail.unitPrice;

                } else {

                    // Se eligió un componente/pieza puntual de la receta del
                    // producto vendido, en vez del producto completo.
                    await this.assertRecipeTarget(
                        detail.productId,
                        data,
                        detail.product.name
                    );

                    if (!detail.product.assembleOnSale) {

                        // La venta descontó el producto terminado, no sus
                        // componentes/piezas (no es un kit armado al vender): el
                        // ítem elegido nunca salió de stock, así que sale ahora
                        // mismo, igual que una devolución directa de inventario.
                        needsDecrementNow = true;

                    }

                }

            }

        }

        if (data.assemblyId) {

            const assembly = await this.productAssemblyRepository.findById(BigInt(data.assemblyId));

            if (!assembly) {
                throw new NotFoundError("La orden de ensamblaje indicada no existe.");
            }

            if (assembly.status !== "CONFIRMED") {
                throw new ValidationError("Solo se puede hacer una devolución de una orden de ensamblaje confirmada.");
            }

            if (data.productId && assembly.productId.toString() === data.productId) {

                // Se devuelve el producto armado por esa orden: ya está en
                // inventario (ASSEMBLY_IN), así que sale ahora mismo.
                needsDecrementNow = true;

            } else {

                this.assertAssemblyRecipeTarget(assembly, data);

            }

        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);

            const returnRecord = await repository.create({
                clientUuid: data.clientUuid,
                number: data.number,
                sale: data.saleId ? { connect: { id: BigInt(data.saleId) } } : undefined,
                saleDetail: data.saleDetailId ? { connect: { id: BigInt(data.saleDetailId) } } : undefined,
                assembly: data.assemblyId ? { connect: { id: BigInt(data.assemblyId) } } : undefined,
                product: data.productId ? { connect: { id: BigInt(data.productId) } } : undefined,
                part: data.partId ? { connect: { id: BigInt(data.partId) } } : undefined,
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

            await this.applyCreateStockEffect(tx, data, fallbackUnitPrice, needsDecrementNow);

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

            if (returnRecord.partId) {

                if (data.disposition === "RESTOCK") {

                    await this.restockPart(
                        tx,
                        returnRecord.partId.toString(),
                        Number(returnRecord.quantity),
                        data.userId,
                        returnRecord.number
                    );

                } else if (data.disposition === "DAMAGED") {

                    await this.damagedPartService.withTransaction(tx).increase(
                        returnRecord.partId,
                        returnRecord.quantity
                    );

                }

            } else if (returnRecord.productId) {

                if (data.disposition === "RESTOCK") {

                    const fallbackUnitPrice = returnRecord.saleDetail?.unitPrice ?? null;

                    await this.restockProduct(
                        tx,
                        returnRecord.productId.toString(),
                        returnRecord.storeId.toString(),
                        Number(returnRecord.quantity),
                        data.userId,
                        returnRecord.number,
                        fallbackUnitPrice
                    );

                } else if (data.disposition === "DAMAGED") {

                    // El stock ya salió de vendible antes (al crear la devolución si
                    // era directa/de ensamblaje, o al confirmarse la venta): acá solo
                    // falta sumarlo a dañados.
                    await this.damagedStockService.withTransaction(tx).increase(
                        returnRecord.productId,
                        returnRecord.storeId,
                        returnRecord.quantity
                    );

                }

            }

            return resolved;

        });

    }

    // Confirma que el producto/pieza elegido para devolver es parte de la
    // receta actual (ProductComponent/EquipmentPart) del kit vendido.
    private async assertRecipeTarget(
        kitProductId: bigint,
        data: CreateReturnDto,
        kitProductName: string
    ) {

        if (data.partId) {

            const parts = await this.equipmentPartRepository.findByProduct(kitProductId);
            const isValid = parts.some(item => item.partId.toString() === data.partId);

            if (!isValid) {
                throw new ValidationError(`La pieza indicada no pertenece a la receta de "${kitProductName}".`);
            }

            return;

        }

        const components = await this.productComponentRepository.findByProduct(kitProductId);
        const isValid = components.some(item => item.componentProductId.toString() === data.productId);

        if (!isValid) {
            throw new ValidationError(`El producto indicado no pertenece a la receta de "${kitProductName}".`);
        }

    }

    // Igual que assertRecipeTarget, pero contra la receta ya congelada de una
    // orden de ensamblaje concreta (lo que esa orden realmente consumió), no
    // contra la receta actual del producto.
    private assertAssemblyRecipeTarget(
        assembly: ProductAssemblyWithRelations,
        data: CreateReturnDto
    ) {

        if (data.partId) {

            const isValid = assembly.partDetails.some(item => item.partId.toString() === data.partId);

            if (!isValid) {
                throw new ValidationError("La pieza indicada no pertenece a la receta de esa orden de ensamblaje.");
            }

            return;

        }

        const isValid = assembly.details.some(item => item.componentProductId.toString() === data.productId);

        if (!isValid) {
            throw new ValidationError("El producto indicado no pertenece a la receta de esa orden de ensamblaje.");
        }

    }

    private async applyCreateStockEffect(
        tx: Prisma.TransactionClient,
        data: CreateReturnDto,
        fallbackUnitPrice: Prisma.Decimal | null,
        needsDecrementNow: boolean
    ) {

        if (data.partId) {

            if (data.disposition === "RESTOCK") {

                await this.restockPart(tx, data.partId, data.quantity, data.userId, data.number);

            } else if (needsDecrementNow) {

                if (data.disposition === "DAMAGED") {
                    await this.decrementPartAndMarkDamaged(tx, data.partId, data.quantity, data.userId, data.number);
                } else {
                    await this.decrementPartPendingReview(tx, data.partId, data.quantity, data.userId, data.number);
                }

            } else if (data.disposition === "DAMAGED") {

                await this.damagedPartService.withTransaction(tx).increase(
                    BigInt(data.partId),
                    new Prisma.Decimal(data.quantity)
                );

            }

            return;

        }

        const productId = data.productId as string;

        if (data.disposition === "RESTOCK") {

            await this.restockProduct(
                tx,
                productId,
                data.storeId,
                data.quantity,
                data.userId,
                data.number,
                fallbackUnitPrice
            );

        } else if (needsDecrementNow) {

            if (data.disposition === "DAMAGED") {
                await this.applyDamageOut(tx, productId, data.storeId, data.quantity, data.userId, data.number);
            } else {
                await this.applyReturnOut(tx, productId, data.storeId, data.quantity, data.userId, data.number);
            }

        } else if (data.disposition === "DAMAGED") {

            await this.damagedStockService.withTransaction(tx).increase(
                BigInt(productId),
                BigInt(data.storeId),
                new Prisma.Decimal(data.quantity)
            );

        }

    }

    // Reingresa la cantidad devuelta al stock vendible del producto elegido.
    private async restockProduct(
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

    // Devolución directa de inventario (sin venta) que se resuelve como dañada
    // en el mismo momento de registrarla: sale de vendible y entra a dañados en
    // una sola operación atómica (mismo tipo de movimiento que usa la página de
    // Movimientos para dar de baja un producto encontrado dañado).
    private async applyDamageOut(
        tx: Prisma.TransactionClient,
        productId: string,
        storeId: string,
        quantity: number,
        userId: string,
        returnNumber: string
    ) {

        const movementType = await this.movementTypeRepository.findByCode("DAMAGE_OUT");

        if (!movementType) {
            throw new NotFoundError(
                'No existe el tipo de movimiento DAMAGE_OUT. Corre "npx tsx scripts/seed-movement-types.ts".'
            );
        }

        const movementService = this.inventoryMovementService.withTransaction(tx);

        await movementService.createWithTransaction({
            movementTypeId: movementType.id,
            productId: BigInt(productId),
            storeId: BigInt(storeId),
            userId: BigInt(userId),
            quantity: new Prisma.Decimal(quantity),
            unitCost: new Prisma.Decimal(0),
            observations: `Devolución ${returnNumber}`,
            movementDate: new Date()
        });

    }

    // Devolución directa de inventario (sin venta) que queda pendiente de
    // revisión: el producto sale de vendible ahora mismo (queda apartado) y se
    // decide después, al resolver, si vuelve a stock o pasa a dañados.
    private async applyReturnOut(
        tx: Prisma.TransactionClient,
        productId: string,
        storeId: string,
        quantity: number,
        userId: string,
        returnNumber: string
    ) {

        const movementType = await this.movementTypeRepository.findByCode("RETURN_OUT");

        if (!movementType) {
            throw new NotFoundError(
                'No existe el tipo de movimiento RETURN_OUT. Corre "npx tsx scripts/seed-movement-types.ts".'
            );
        }

        const movementService = this.inventoryMovementService.withTransaction(tx);

        await movementService.createWithTransaction({
            movementTypeId: movementType.id,
            productId: BigInt(productId),
            storeId: BigInt(storeId),
            userId: BigInt(userId),
            quantity: new Prisma.Decimal(quantity),
            unitCost: new Prisma.Decimal(0),
            observations: `Devolución ${returnNumber}: pendiente de revisión`,
            movementDate: new Date()
        });

    }

    // Reingresa la cantidad devuelta a la existencia de la pieza.
    private async restockPart(
        tx: Prisma.TransactionClient,
        partId: string,
        quantity: number,
        userId: string,
        returnNumber: string
    ) {

        const partRepository = this.partRepository.withTransaction(tx);
        const partMovementRepository = this.partMovementRepository.withTransaction(tx);

        await partMovementRepository.create({
            number: `DEVOLUCION-${returnNumber}-INGRESO`,
            type: "IN",
            userId,
            movementDate: new Date(),
            observations: `Devolución ${returnNumber}`,
            details: [{ partId, quantity }]
        });

        await partRepository.incrementQuantity(BigInt(partId), new Prisma.Decimal(quantity));

    }

    // Devolución directa de pieza (sin venta ni ensamblaje) que queda pendiente
    // de revisión: sale de existencia ahora mismo y se decide después.
    private async decrementPartPendingReview(
        tx: Prisma.TransactionClient,
        partId: string,
        quantity: number,
        userId: string,
        returnNumber: string
    ) {

        const partRepository = this.partRepository.withTransaction(tx);
        const partMovementRepository = this.partMovementRepository.withTransaction(tx);

        await partMovementRepository.create({
            number: `DEVOLUCION-${returnNumber}-SALIDA`,
            type: "OUT",
            userId,
            movementDate: new Date(),
            observations: `Devolución ${returnNumber}: pendiente de revisión`,
            details: [{ partId, quantity }]
        });

        await partRepository.decrementQuantity(BigInt(partId), new Prisma.Decimal(quantity));

    }

    // Devolución directa de pieza que se resuelve como dañada en el mismo
    // momento de registrarla: sale de existencia y entra a piezas dañadas.
    private async decrementPartAndMarkDamaged(
        tx: Prisma.TransactionClient,
        partId: string,
        quantity: number,
        userId: string,
        returnNumber: string
    ) {

        const partRepository = this.partRepository.withTransaction(tx);
        const partMovementRepository = this.partMovementRepository.withTransaction(tx);

        await partMovementRepository.create({
            number: `DEVOLUCION-${returnNumber}-SALIDA`,
            type: "OUT",
            userId,
            movementDate: new Date(),
            observations: `Devolución ${returnNumber}`,
            details: [{ partId, quantity }]
        });

        await partRepository.decrementQuantity(BigInt(partId), new Prisma.Decimal(quantity));

        await this.damagedPartService.withTransaction(tx).increase(
            BigInt(partId),
            new Prisma.Decimal(quantity)
        );

    }

}
