import { Prisma, Sale } from "@prisma/client";
import { SaleRepository } from "./sale.repository.js";
import { CreateSaleDto, UpdateSaleDto } from "./sale.dto.js";
import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { prisma } from "../../database/index.js";
import { InventoryMovementService } from "../inventory-movement/inventory-movement.service.js";
import { MovementTypeRepository } from "../movement-type/movement-type.repository.js";
import { ClientRepository } from "../client/client.repository.js";
import { AccountReceivableRepository } from "../account-receivable/account-receivable.repository.js";
import { ProductRepository } from "../product/product.repository.js";
import { InventoryStockService } from "../inventory-stock/inventory-stock.service.js";
import { ProductComponentRepository } from "../product-component/product-component.repository.js";
import { EquipmentPartRepository } from "../equipment-part/equipment-part.repository.js";
import { PartRepository } from "../part/part.repository.js";
import { PartMovementRepository } from "../part-movement/part-movement.repository.js";
import { TelegramService, escapeTelegramHtml } from "../../integrations/telegram/telegram.service.js";
import { ROLES } from "../../shared/constants/roles.js";
import { notifyAdmins } from "../../realtime/realtime.service.js";
import type { SaleWithRelations } from "./sale.repository.js";

export class SaleService {

    private readonly repository = new SaleRepository();
    private readonly inventoryMovementService =
        new InventoryMovementService();

    private readonly movementTypeRepository =
        new MovementTypeRepository();

    private readonly clientRepository =
        new ClientRepository();

    private readonly accountReceivableRepository =
        new AccountReceivableRepository();

    private readonly productRepository =
        new ProductRepository();

    private readonly inventoryStockService =
        new InventoryStockService();

    private readonly productComponentRepository =
        new ProductComponentRepository();

    private readonly equipmentPartRepository =
        new EquipmentPartRepository();

    private readonly partRepository =
        new PartRepository();

    private readonly partMovementRepository =
        new PartMovementRepository();

    private readonly telegramService =
        new TelegramService();

    // Kits (Product.assembleOnSale = true) no llevan stock propio: se arman al
    // momento de la venta combinando sus componentes/piezas segun la receta
    // (ProductComponent / EquipmentPart), escalada por la cantidad vendida.
    private async getRecipeRequirements(
        productId: bigint,
        quantity: number
    ) {

        const [components, parts] = await Promise.all([
            this.productComponentRepository.findByProduct(productId),
            this.equipmentPartRepository.findByProduct(productId)
        ]);

        return {
            components: components.map(item => ({
                componentProductId: item.componentProductId,
                componentProduct: item.componentProduct,
                quantity: new Prisma.Decimal(item.quantity).times(quantity)
            })),
            parts: parts.map(item => ({
                partId: item.partId,
                part: item.part,
                quantity: new Prisma.Decimal(item.quantity).times(quantity)
            }))
        };

    }

    async findAll(
        requestingUser?: { roleName: string; storeId: string }
    ): Promise<Sale[]> {

        const storeId =
            requestingUser?.roleName === ROLES.STORE
                ? BigInt(requestingUser.storeId)
                : undefined;

        return this.repository.findAll(storeId);
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

    private async validatePaymentMethod(
        data: {
            paymentMethod?: string;
            paymentMethods?: { method: string; amount: number }[];
            transferVouchers?: string[];
            accountReceivableNumber?: string;
            downPayment?: number;
            downPaymentMethods?: { method: string; amount: number }[];
            downPaymentVouchers?: string[];
        },
        excludeAccountReceivableId?: bigint
    ): Promise<boolean> {

        if (!data.paymentMethod) {
            throw new ValidationError(
                "Seleccione la forma de pago."
            );
        }

        const requiresAccountReceivable =
            data.paymentMethod === "CREDIT";

        if (!requiresAccountReceivable) {

            if (!data.paymentMethods || data.paymentMethods.length === 0) {
                throw new ValidationError(
                    "Debe indicar al menos un método de pago."
                );
            }

            const hasTransfer = data.paymentMethods.some(entry => entry.method === "TRANSFER");

            if (hasTransfer && (!data.transferVouchers || data.transferVouchers.length === 0)) {
                throw new ValidationError(
                    "Debe indicar al menos un número de comprobante de la transferencia."
                );
            }

        }

        if (requiresAccountReceivable) {

            if (!data.accountReceivableNumber) {
                throw new ValidationError(
                    "Debe indicar el número de cuenta de cobro."
                );
            }

            const existingReceivable = await this.accountReceivableRepository.findByNumber(
                data.accountReceivableNumber
            );

            if (existingReceivable && existingReceivable.id !== excludeAccountReceivableId) {
                throw new ConflictError(
                    "Ya existe una cuenta de cobro con ese número."
                );
            }

            if (data.downPayment && data.downPayment > 0) {

                const hasDownPaymentTransfer = (data.downPaymentMethods ?? []).some(
                    entry => entry.method === "TRANSFER"
                );

                if (hasDownPaymentTransfer && (!data.downPaymentVouchers || data.downPaymentVouchers.length === 0)) {
                    throw new ValidationError(
                        "Debe indicar al menos un número de comprobante del abono."
                    );
                }

            }

        }

        return requiresAccountReceivable;

    }

    private assertPaymentMethodsMatchAmount(
        paymentMethods: { amount: number }[] | undefined,
        expectedAmount: number,
        errorLabel: string
    ): void {

        const sum = (paymentMethods ?? []).reduce((total, entry) => total + entry.amount, 0);

        if (Math.abs(sum - expectedAmount) > 0.01) {
            throw new ValidationError(
                `La suma de los métodos de pago (${sum}) no coincide con ${errorLabel} (${expectedAmount}).`
            );
        }

    }

    private async validateDetailsStock(
        details: { productId: string; quantity: number }[],
        storeId: string
    ): Promise<void> {

        for (const detail of details) {

            const product = await this.productRepository.findById(
                BigInt(detail.productId)
            );

            if (!product) {
                throw new NotFoundError(
                    "Uno de los productos seleccionados no existe."
                );
            }

            if (product.assembleOnSale) {

                const { components, parts } = await this.getRecipeRequirements(
                    product.id,
                    detail.quantity
                );

                if (components.length === 0 && parts.length === 0) {
                    throw new ValidationError(
                        `"${product.name}" está marcado como kit (se arma al vender), pero no tiene una receta de componentes ni de piezas definida.`
                    );
                }

                for (const item of components) {

                    const stock = await this.inventoryStockService.findByProductAndStore(
                        item.componentProductId.toString(),
                        storeId
                    );

                    const available = stock ? Number(stock.quantity) : 0;

                    if (available < Number(item.quantity)) {
                        throw new ValidationError(
                            `Stock insuficiente de "${item.componentProduct.name}" (componente de "${product.name}"): disponible ${available}, requerido ${Number(item.quantity)}.`
                        );
                    }

                }

                for (const item of parts) {

                    const available = Number(item.part.quantity);

                    if (available < Number(item.quantity)) {
                        throw new ValidationError(
                            `Stock insuficiente de la pieza "${item.part.name}" (componente de "${product.name}"): disponible ${available}, requerido ${Number(item.quantity)}.`
                        );
                    }

                }

                continue;

            }

            const stock = await this.inventoryStockService.findByProductAndStore(
                detail.productId,
                storeId
            );

            const available = stock ? Number(stock.quantity) : 0;

            if (available < detail.quantity) {
                throw new ValidationError(
                    `Stock insuficiente de "${product.name}": disponible ${available}, solicitado ${detail.quantity}.`
                );
            }

        }

    }

    // Genera el siguiente consecutivo de una tienda a partir del último número
    // registrado en ella (ej. "VEN-004" -> "VEN-005"). Si la tienda no tiene
    // ventas previas, arranca en "VEN-001".
    private buildNextSaleNumber(
        lastNumber: string | null | undefined
    ): string {

        if (!lastNumber) {
            return "VEN-001";
        }

        const match = lastNumber.match(/^(.*?)(\d+)$/);

        if (!match) {
            return "VEN-001";
        }

        const [, prefix, digits] = match;
        const next = (Number(digits) + 1).toString().padStart(digits.length, "0");

        return `${prefix}${next}`;

    }

    // Vista previa del consecutivo que se asignará al guardar (no reserva
    // número: si otra venta de la misma tienda se confirma antes, el número
    // real se recalcula en create() bajo bloqueo).
    async previewNextNumber(
        storeId: string
    ): Promise<string> {

        const lastSale = await this.repository.findLastByStore(
            BigInt(storeId)
        );

        return this.buildNextSaleNumber(lastSale?.number);

    }

    async create(
        data: CreateSaleDto
    ): Promise<Sale> {

        if (data.clientUuid) {

            const existingByClientUuid = await this.repository.findByClientUuid(
                data.clientUuid
            );

            if (existingByClientUuid) {
                return existingByClientUuid;
            }

        }

        const client = await this.clientRepository.findById(
            BigInt(data.clientId)
        );

        if (!client) {
            throw new NotFoundError(
                "El cliente no existe."
            );
        }

        const requiresAccountReceivable = await this.validatePaymentMethod(data);

        await this.validateDetailsStock(data.details, data.storeId);

        return prisma.$transaction(async (tx) => {

            const saleRepository = this.repository.withTransaction(tx);

            // El número de venta es un consecutivo por tienda: se calcula y
            // asigna aquí, nunca lo decide el cliente. Se bloquea la fila de
            // la tienda para evitar que dos ventas concurrentes de la misma
            // tienda calculen el mismo consecutivo.
            await saleRepository.lockStoreForNumbering(
                BigInt(data.storeId)
            );

            const lastSale = await saleRepository.findLastByStore(
                BigInt(data.storeId)
            );

            const saleData = {
                ...data,
                number: this.buildNextSaleNumber(lastSale?.number),
                currency: client.isWholesaler && client.currency
                    ? client.currency
                    : data.currency
            };

            const sale = await saleRepository.create(saleData);

            if (!requiresAccountReceivable) {
                this.assertPaymentMethodsMatchAmount(
                    data.paymentMethods,
                    Number(sale.total),
                    "el total de la venta"
                );
            }

            if (requiresAccountReceivable) {

                const downPayment = data.downPayment ?? 0;
                const originalAmount = Number(sale.total);
                const amount = originalAmount - downPayment;

                if (downPayment > originalAmount) {
                    throw new ValidationError(
                        `El abono (${downPayment}) no puede ser mayor que el total de la venta (${originalAmount}).`
                    );
                }

                if (downPayment > 0) {
                    this.assertPaymentMethodsMatchAmount(
                        data.downPaymentMethods,
                        downPayment,
                        "el monto del abono"
                    );
                }

                const dueDate = data.termDays
                    ? new Date(sale.saleDate.getTime() + data.termDays * 24 * 60 * 60 * 1000)
                    : undefined;

                const accountReceivableRepository =
                    this.accountReceivableRepository.withTransaction(tx);

                await accountReceivableRepository.create({
                    number: data.accountReceivableNumber!,
                    clientId: sale.clientId,
                    saleId: sale.id,
                    originalAmount,
                    amount,
                    currency: sale.currency,
                    downPayment,
                    downPaymentMethods: downPayment > 0 ? data.downPaymentMethods : undefined,
                    downPaymentVouchers: downPayment > 0 ? data.downPaymentVouchers : undefined,
                    termDays: data.termDays,
                    dueDate
                });

            }

            return sale;

        });

    }

    async update(
        id: string,
        data: UpdateSaleDto,
        requestingUser?: { roleName: string; storeId: string }
    ): Promise<Sale> {

        const sale = await this.repository.findById(
            BigInt(id)
        );

        if (!sale) {
            throw new NotFoundError(
                "Venta no encontrada."
            );
        }

        if (
            requestingUser?.roleName === ROLES.STORE &&
            sale.storeId.toString() !== requestingUser.storeId
        ) {
            throw new ValidationError(
                "Solo puedes editar ventas de tu propia tienda."
            );
        }

        if (sale.status !== "DRAFT") {
            throw new ValidationError(
                "Solo se pueden editar ventas en borrador."
            );
        }

        const requiresAccountReceivable = await this.validatePaymentMethod(
            data,
            sale.accountReceivable?.id
        );

        await this.validateDetailsStock(data.details, data.storeId);

        return prisma.$transaction(async (tx) => {

            const saleRepository = this.repository.withTransaction(tx);
            const accountReceivableRepository = this.accountReceivableRepository.withTransaction(tx);

            const updatedSale = await saleRepository.update(
                BigInt(id),
                data
            );

            if (!requiresAccountReceivable) {
                this.assertPaymentMethodsMatchAmount(
                    data.paymentMethods,
                    Number(updatedSale.total),
                    "el total de la venta"
                );
            }

            if (requiresAccountReceivable) {

                const downPayment = data.downPayment ?? 0;
                const originalAmount = Number(updatedSale.total);
                const amount = originalAmount - downPayment;

                if (downPayment > originalAmount) {
                    throw new ValidationError(
                        `El abono (${downPayment}) no puede ser mayor que el total de la venta (${originalAmount}).`
                    );
                }

                if (downPayment > 0) {
                    this.assertPaymentMethodsMatchAmount(
                        data.downPaymentMethods,
                        downPayment,
                        "el monto del abono"
                    );
                }

                const dueDate = data.termDays
                    ? new Date(updatedSale.saleDate.getTime() + data.termDays * 24 * 60 * 60 * 1000)
                    : undefined;

                await accountReceivableRepository.upsertForSale(updatedSale.id, {
                    number: data.accountReceivableNumber!,
                    clientId: updatedSale.clientId,
                    saleId: updatedSale.id,
                    originalAmount,
                    amount,
                    currency: updatedSale.currency,
                    downPayment,
                    downPaymentMethods: downPayment > 0 ? data.downPaymentMethods : undefined,
                    downPaymentVouchers: downPayment > 0 ? data.downPaymentVouchers : undefined,
                    termDays: data.termDays,
                    dueDate
                });

            } else if (sale.accountReceivable) {

                await accountReceivableRepository.deleteBySaleId(updatedSale.id);

            }

            return updatedSale;

        });

    }


    async delete(
        id: string,
        requestingUser?: { roleName: string; storeId: string }
    ): Promise<void> {

        const sale = await this.repository.findById(
            BigInt(id)
        );

        if (!sale) {
            throw new NotFoundError(
                "Venta no encontrada."
            );
        }

        if (
            requestingUser?.roleName === ROLES.STORE &&
            sale.storeId.toString() !== requestingUser.storeId
        ) {
            throw new ValidationError(
                "Solo puedes cancelar ventas de tu propia tienda."
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

            const partRepository =
                this.partRepository.withTransaction(tx);

            const partMovementRepository =
                this.partMovementRepository.withTransaction(tx);

            // Piezas requeridas por todos los kits vendidos en esta venta,
            // agregadas por pieza (una sola pieza puede repetirse en varios
            // kits distintos de la misma venta).
            const aggregatedPartRequirements = new Map<string, {
                partId: bigint;
                partName: string;
                quantity: Prisma.Decimal;
            }>();

            for (const detail of sale.details) {

                if (detail.product.assembleOnSale) {

                    const { components, parts } = await this.getRecipeRequirements(
                        detail.productId,
                        Number(detail.quantity)
                    );

                    if (components.length === 0 && parts.length === 0) {
                        throw new ValidationError(
                            `"${detail.product.name}" está marcado como kit, pero ya no tiene una receta de componentes ni de piezas definida.`
                        );
                    }

                    for (const item of components) {

                        await movementService.createWithTransaction({
                            movementTypeId: movementType.id,
                            productId: item.componentProductId,
                            storeId: sale.storeId,
                            userId: sale.userId,
                            clientId: sale.clientId,
                            quantity: item.quantity,
                            unitCost: item.componentProduct.costPrice,
                            observations: `Venta ${sale.number}: consumo de "${item.componentProduct.name}" (componente de "${detail.product.name}")`,
                            movementDate: sale.saleDate
                        });

                    }

                    for (const item of parts) {

                        const key = item.partId.toString();
                        const existing = aggregatedPartRequirements.get(key);

                        aggregatedPartRequirements.set(key, {
                            partId: item.partId,
                            partName: item.part.name,
                            quantity: existing
                                ? existing.quantity.plus(item.quantity)
                                : item.quantity
                        });

                    }

                    continue;

                }

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

            if (aggregatedPartRequirements.size > 0) {

                const partRequirements = [...aggregatedPartRequirements.values()];

                for (const item of partRequirements) {

                    const part = await partRepository.findById(item.partId);
                    const available = part ? Number(part.quantity) : 0;

                    if (available < Number(item.quantity)) {
                        throw new ValidationError(
                            `Stock insuficiente de la pieza "${item.partName}": disponible ${available}, requerido ${Number(item.quantity)}.`
                        );
                    }

                }

                await partMovementRepository.create({
                    number: `VENTA-${sale.number}`,
                    type: "OUT",
                    userId: sale.userId.toString(),
                    movementDate: sale.saleDate,
                    observations: `Venta ${sale.number}: consumo de piezas para kits vendidos`,
                    details: partRequirements.map(item => ({
                        partId: item.partId.toString(),
                        quantity: Number(item.quantity)
                    }))
                });

                for (const item of partRequirements) {
                    await partRepository.decrementQuantity(
                        item.partId,
                        item.quantity
                    );
                }

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

        }).then((confirmedSale) => {

            void this.notifyNewSale(confirmedSale);
            void this.notifyRealtimeSaleConfirmed(confirmedSale);
            void this.notifyRealtimeLowStockAfterSale(confirmedSale);

            return confirmedSale;

        });

    }

    private async notifyNewSale(
        sale: SaleWithRelations
    ): Promise<void> {

        try {

            const clientName =
                sale.client.companyName ||
                `${sale.client.firstName ?? ""} ${sale.client.lastName ?? ""}`.trim() ||
                "Cliente";

            const itemCount = sale.details.length;

            const message =
                "🟢 <b>Venta confirmada</b>\n" +
                `${escapeTelegramHtml(sale.number)} - ${escapeTelegramHtml(clientName)}\n` +
                `Tienda: ${escapeTelegramHtml(sale.store.name)}\n` +
                `${itemCount} producto(s) — Total: ${sale.currency} ${Number(sale.total).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            await this.telegramService.sendMessage(message);

        } catch (error) {
            console.error("❌ Error enviando alerta de venta a Telegram:", error);
        }

    }

    private async notifyRealtimeSaleConfirmed(
        sale: SaleWithRelations
    ): Promise<void> {

        const clientName =
            sale.client.companyName ||
            `${sale.client.firstName ?? ""} ${sale.client.lastName ?? ""}`.trim() ||
            "Cliente";

        notifyAdmins("sale:confirmed", {
            saleId: sale.id.toString(),
            number: sale.number,
            storeName: sale.store.name,
            clientName,
            currency: sale.currency,
            total: sale.total.toString()
        });

    }

    // Solo revisa el stock de los productos vendidos directamente (no de los
    // componentes de un kit): los kits no llevan stock propio, ver
    // getRecipeRequirements() más arriba.
    private async notifyRealtimeLowStockAfterSale(
        sale: SaleWithRelations
    ): Promise<void> {

        for (const detail of sale.details) {

            if (detail.product.assembleOnSale) {
                continue;
            }

            const stock = await this.inventoryStockService.findByProductAndStore(
                detail.productId.toString(),
                sale.storeId.toString()
            );

            const quantity = stock ? Number(stock.quantity) : 0;
            const minimumStock = Number(detail.product.minimumStock);

            if (quantity <= minimumStock) {

                notifyAdmins("stock:low", {
                    productId: detail.product.id.toString(),
                    productName: detail.product.name,
                    storeName: sale.store.name,
                    quantity,
                    minimumStock
                });

            }

        }

    }

}
