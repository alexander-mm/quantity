import { Sale } from "@prisma/client";
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
import { TelegramService, escapeTelegramHtml } from "../../integrations/telegram/telegram.service.js";
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

    private readonly telegramService =
        new TelegramService();

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

        if (data.clientUuid) {

            const existingByClientUuid = await this.repository.findByClientUuid(
                data.clientUuid
            );

            if (existingByClientUuid) {
                return existingByClientUuid;
            }

        }

        const existing = await this.repository.findByNumber(
            data.number
        );

        if (existing) {
            throw new ConflictError(
                "Ya existe una venta con ese número."
            );
        }

        const client = await this.clientRepository.findById(
            BigInt(data.clientId)
        );

        if (!client) {
            throw new NotFoundError(
                "El cliente no existe."
            );
        }

        const requiresAccountReceivable =
            client.isWholesaler && client.usesCredit;

        if (requiresAccountReceivable) {

            if (!data.accountReceivableNumber) {
                throw new ValidationError(
                    "Debe indicar el número de cuenta de cobro para este cliente mayorista."
                );
            }

            const existingReceivable = await this.accountReceivableRepository.findByNumber(
                data.accountReceivableNumber
            );

            if (existingReceivable) {
                throw new ConflictError(
                    "Ya existe una cuenta de cobro con ese número."
                );
            }

        }

        for (const detail of data.details) {

            const product = await this.productRepository.findById(
                BigInt(detail.productId)
            );

            if (!product) {
                throw new NotFoundError(
                    "Uno de los productos seleccionados no existe."
                );
            }

            const stock = await this.inventoryStockService.findByProductAndStore(
                detail.productId,
                data.storeId
            );

            const available = stock ? Number(stock.quantity) : 0;

            if (available < detail.quantity) {
                throw new ValidationError(
                    `Stock insuficiente de "${product.name}": disponible ${available}, solicitado ${detail.quantity}.`
                );
            }

        }

        const saleData: CreateSaleDto = {
            ...data,
            currency: client.isWholesaler && client.currency
                ? client.currency
                : data.currency
        };

        return prisma.$transaction(async (tx) => {

            const saleRepository = this.repository.withTransaction(tx);
            const sale = await saleRepository.create(saleData);

            if (requiresAccountReceivable) {

                const accountReceivableRepository =
                    this.accountReceivableRepository.withTransaction(tx);

                await accountReceivableRepository.create({
                    number: data.accountReceivableNumber!,
                    clientId: sale.clientId,
                    saleId: sale.id,
                    amount: Number(sale.total),
                    currency: sale.currency
                });

            }

            return sale;

        });

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

        }).then((confirmedSale) => {

            void this.notifyNewSale(confirmedSale);

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

}
