import { Prisma, StockTransfer } from "@prisma/client";
import { prisma } from "../../database/index.js";
import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { StockTransferRepository } from "./stock-transfer.repository.js";
import { StoreRepository } from "../store/store.repository.js";
import { InventoryMovementService } from "../inventory-movement/inventory-movement.service.js";
import { MovementTypeRepository } from "../movement-type/movement-type.repository.js";
import { CreateStockTransferDto, ReportIssueStockTransferDto, ResolveStockTransferDto } from "./stock-transfer.dto.js";
import { UserRepository } from "../user/user.repository.js";
import { ROLES } from "../../shared/constants/roles.js";

export class StockTransferService {

    private readonly repository = new StockTransferRepository();
    private readonly storeRepository = new StoreRepository();
    private readonly movementTypeRepository = new MovementTypeRepository();
    private readonly inventoryMovementService = new InventoryMovementService();
    private readonly userRepository = new UserRepository();

    async findAll() {
        return this.repository.findAll();
    }

    async findAllForUser(storeId: string, userId: string) {
        return this.repository.findAllForUser({
            storeId: BigInt(storeId),
            userId: BigInt(userId)
        });
    }

    async findById(id: string) {
        const transfer = await this.repository.findById(BigInt(id));
        if (!transfer) {
            throw new NotFoundError("Envío no encontrado.");
        }
        return transfer;
    }

    async create(data: CreateStockTransferDto): Promise<StockTransfer> {

        const existing = await this.repository.findByNumber(data.number);
        if (existing) {
            throw new ConflictError("Ya existe un envío con ese número.");
        }

        const originStore = await this.storeRepository.findById(BigInt(data.originStoreId));
        if (!originStore) {
            throw new NotFoundError("El origen no existe.");
        }

        let destStore = null;
        let destUser = null;

        if (data.destType === "STORE") {

            if (!data.destStoreId) {
                throw new ValidationError("Seleccione la tienda o bodega destino.");
            }

            if (data.destStoreId === data.originStoreId) {
                throw new ValidationError("El origen y el destino no pueden ser el mismo.");
            }

            destStore = await this.storeRepository.findById(BigInt(data.destStoreId));
            if (!destStore) {
                throw new NotFoundError("La tienda/bodega destino no existe.");
            }

        } else {

            if (!data.destUserId) {
                throw new ValidationError("Seleccione el técnico destino.");
            }

            destUser = await this.userRepository.findById(BigInt(data.destUserId));
            if (!destUser) {
                throw new NotFoundError("El técnico no existe.");
            }

            if (destUser.role.name !== ROLES.TECHNICIAN) {
                throw new ValidationError("El usuario seleccionado no tiene rol de Técnico.");
            }

        }

        if (data.details.length === 0) {
            throw new ValidationError("El envío no tiene productos.");
        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const transfer = await repository.create(data);

            const movementTypeCode = data.destType === "TECHNICIAN" ? "STAFF_DELIVERY" : "TRANSFER_OUT";

            const movementType = await this.movementTypeRepository.findByCode(movementTypeCode);
            if (!movementType) {
                throw new NotFoundError(`No existe el tipo de movimiento ${movementTypeCode}.`);
            }

            const movementService = this.inventoryMovementService.withTransaction(tx);

            const destLabel = data.destType === "TECHNICIAN"
                ? `${destUser!.firstName} ${destUser!.lastName}`
                : destStore!.name;

            for (const detail of transfer.details) {

                await movementService.createWithTransaction({
                    movementTypeId: movementType.id,
                    productId: detail.productId,
                    storeId: transfer.originStoreId,
                    userId: transfer.userId,
                    quantity: detail.quantitySent,
                    unitCost: detail.product.costPrice,
                    observations: `Envío ${transfer.number} a ${destLabel}`,
                    movementDate: transfer.dispatchDate
                });

            }

            return transfer;

        });

    }


    async confirmReceipt(id: string, userId: string): Promise<StockTransfer> {

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const transfer = await repository.findById(BigInt(id));

            if (!transfer) {
                throw new NotFoundError("Envío no encontrado.");
            }

            if (transfer.status !== "PENDING") {
                throw new ValidationError("Este envío ya fue procesado.");
            }

            if (transfer.destType === "STORE") {

                const movementType = await this.movementTypeRepository.findByCode("TRANSFER_IN");
                if (!movementType) {
                    throw new NotFoundError("No existe el tipo de movimiento TRANSFER_IN.");
                }

                const movementService = this.inventoryMovementService.withTransaction(tx);

                for (const detail of transfer.details) {

                    await movementService.createWithTransaction({
                        movementTypeId: movementType.id,
                        productId: detail.productId,
                        storeId: transfer.destStoreId!,
                        userId: BigInt(userId),
                        quantity: detail.quantitySent,
                        unitCost: detail.product.costPrice,
                        observations: `Recepción envío ${transfer.number}`,
                        movementDate: new Date()
                    });

                    await repository.updateDetailReceived(detail.id, Number(detail.quantitySent));

                }

            } else {

                // Destino técnico: el producto ya salió del inventario al despachar (STAFF_DELIVERY).
                // Confirmar solo registra el acuse de recibo, sin mover stock.
                for (const detail of transfer.details) {
                    await repository.updateDetailReceived(detail.id, Number(detail.quantitySent));
                }

            }

            return repository.updateStatus(transfer.id, {
                status: "RECEIVED",
                receivedAt: new Date(),
                receivedBy: BigInt(userId)
            });

        });

    }


    async reportIssue(id: string, data: ReportIssueStockTransferDto): Promise<StockTransfer> {

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const transfer = await repository.findById(BigInt(id));

            if (!transfer) {
                throw new NotFoundError("Envío no encontrado.");
            }

            if (transfer.status !== "PENDING") {
                throw new ValidationError("Este envío ya fue procesado.");
            }

            for (const item of data.details) {

                const detail = transfer.details.find(
                    d => d.productId.toString() === item.productId
                );

                if (!detail) {
                    throw new ValidationError("Uno de los productos no pertenece a este envío.");
                }

                await repository.updateDetailReceived(detail.id, item.quantityReceived);

            }

            return repository.updateStatus(transfer.id, {
                status: "WITH_ISSUES",
                observations: data.observations
            });

        });

    }

    async resolve(id: string, data: ResolveStockTransferDto): Promise<StockTransfer> {

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const transfer = await repository.findById(BigInt(id));

            if (!transfer) {
                throw new NotFoundError("Envío no encontrado.");
            }

            if (transfer.status !== "WITH_ISSUES") {
                throw new ValidationError("Solo se pueden resolver envíos con novedad.");
            }

            const inMovementType = transfer.destType === "STORE"
                ? await this.movementTypeRepository.findByCode("TRANSFER_IN")
                : null;

            if (transfer.destType === "STORE" && !inMovementType) {
                throw new NotFoundError("No existe el tipo de movimiento TRANSFER_IN.");
            }

            let outMovementType = null;

            if (transfer.destType === "STORE") {

                const hasExcess = data.details.some(item => {
                    const detail = transfer.details.find(d => d.productId.toString() === item.productId);
                    return !!detail && item.quantityReceived > Number(detail.quantitySent);
                });

                if (hasExcess) {

                    outMovementType = await this.movementTypeRepository.findByCode("TRANSFER_OUT");

                    if (!outMovementType) {
                        throw new NotFoundError("No existe el tipo de movimiento TRANSFER_OUT.");
                    }

                }

            }

            const movementService = this.inventoryMovementService.withTransaction(tx);

            for (const item of data.details) {

                const detail = transfer.details.find(
                    d => d.productId.toString() === item.productId
                );

                if (!detail) {
                    throw new ValidationError("Uno de los productos no pertenece a este envío.");
                }

                if (transfer.destType === "STORE" && item.quantityReceived > 0) {

                    await movementService.createWithTransaction({
                        movementTypeId: inMovementType!.id,
                        productId: detail.productId,
                        storeId: transfer.destStoreId!,
                        userId: transfer.userId,
                        quantity: new Prisma.Decimal(item.quantityReceived),
                        unitCost: detail.product.costPrice,
                        observations: `Resolución de novedad - envío ${transfer.number}`,
                        movementDate: new Date()
                    });

                }

                const excess = item.quantityReceived - Number(detail.quantitySent);

                if (transfer.destType === "STORE" && excess > 0) {

                    // Llegó más de lo que el origen registró como enviado: se corrige el origen
                    // por la diferencia, para que el total del sistema quede balanceado.
                    await movementService.createWithTransaction({
                        movementTypeId: outMovementType!.id,
                        productId: detail.productId,
                        storeId: transfer.originStoreId,
                        userId: transfer.userId,
                        quantity: new Prisma.Decimal(excess),
                        unitCost: detail.product.costPrice,
                        observations: `Corrección de envío ${transfer.number}: se confirmaron ${item.quantityReceived} recibidos vs ${detail.quantitySent} despachados originalmente.`,
                        movementDate: new Date()
                    });

                } else if (transfer.destType === "STORE" && excess < 0) {

                    // Llegó menos de lo que el origen registró como enviado: la diferencia se
                    // devuelve al origen, porque el descargo original se hizo por lo enviado,
                    // no por lo que el admin terminó confirmando como recibido.
                    await movementService.createWithTransaction({
                        movementTypeId: inMovementType!.id,
                        productId: detail.productId,
                        storeId: transfer.originStoreId,
                        userId: transfer.userId,
                        quantity: new Prisma.Decimal(-excess),
                        unitCost: detail.product.costPrice,
                        observations: `Corrección de envío ${transfer.number}: se confirmaron ${item.quantityReceived} recibidos vs ${detail.quantitySent} despachados originalmente.`,
                        movementDate: new Date()
                    });

                }

                // Destino técnico: no se mueve stock al resolver (la devolución es otra función, pendiente).

                await repository.updateDetailReceived(detail.id, item.quantityReceived);

            }

            return repository.updateStatus(transfer.id, { status: "RECEIVED" });

        });

    }

}