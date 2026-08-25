import { InventoryMovement, MovementType, Prisma } from "@prisma/client";
import { prisma } from "../../database/index.js";
import { CreateInventoryMovementDto, UpdateInventoryMovementDto } from "./inventory-movement.dto.js";
import { NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { InventoryMovementRepository } from "./inventory-movement.repository.js";
import { ProductRepository } from "../product/product.repository.js";
import { StoreRepository } from "../store/store.repository.js";
import { UserRepository } from "../user/user.repository.js";
import { ClientRepository } from "../client/client.repository.js";
import { MovementTypeRepository } from "../movement-type/movement-type.repository.js";
import { InventoryStockService } from "../inventory-stock/inventory-stock.service.js";
import { DamagedStockService } from "../damaged-stock/damaged-stock.service.js";

export class InventoryMovementService {

    private readonly productRepository = new ProductRepository();
    private readonly storeRepository = new StoreRepository();
    private readonly userRepository = new UserRepository();
    private readonly clientRepository = new ClientRepository();
    private readonly movementTypeRepository = new MovementTypeRepository();
    private readonly repository: InventoryMovementRepository;
    private readonly inventoryStockService: InventoryStockService;
    private readonly damagedStockService: DamagedStockService;

    constructor(
        repository?: InventoryMovementRepository,
        inventoryStockService?: InventoryStockService,
        damagedStockService?: DamagedStockService
    ) {
        this.repository =
            repository ??
            new InventoryMovementRepository(prisma);

        this.inventoryStockService =
            inventoryStockService ??
            new InventoryStockService();

        this.damagedStockService =
            damagedStockService ??
            new DamagedStockService();
    }

    async findAll() {
        return this.repository.findAll();
    }

    async findById(
        id: string
    ) {
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

    private async createInternal(
        data: CreateInventoryMovementDto,
        movementType: Awaited<ReturnType<MovementTypeRepository["findById"]>>
    ): Promise<InventoryMovement> {

        const movement =
            await this.repository.create(data);

        if (
            movementType &&
            movementType.affectsStock
        ) {

            switch (
            movementType.stockOperation
            ) {

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

                    if (movementType.code === "DAMAGE_OUT") {

                        await this.damagedStockService.increase(
                            BigInt(data.productId),
                            BigInt(data.storeId),
                            new Prisma.Decimal(data.quantity)
                        );

                    }

                    break;

                case "NONE":

                    break;

            }

        }

        return movement;

    }

    private async validateReferences(
        data: CreateInventoryMovementDto | UpdateInventoryMovementDto
    ): Promise<MovementType> {

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

        return movementType;

    }

    async create(
        data: CreateInventoryMovementDto
    ): Promise<InventoryMovement> {

        const movementType = await this.validateReferences(data);

        return prisma.$transaction(async (tx) => {

            const service = this.withTransaction(tx);

            return service.createInternal(
                data,
                movementType
            );

        });
    }

    // Movimiento manual registrado desde la pagina de Movimientos: queda en
    // borrador y no afecta el inventario hasta que se confirme.
    async createDraft(
        data: CreateInventoryMovementDto
    ): Promise<InventoryMovement> {

        await this.validateReferences(data);

        return this.repository.create(data, "DRAFT");

    }

    async update(
        id: string,
        data: UpdateInventoryMovementDto
    ): Promise<InventoryMovement> {

        const movement = await this.repository.findById(
            BigInt(id)
        );

        if (!movement) {
            throw new NotFoundError(
                "Movimiento no encontrado."
            );
        }

        if (movement.status !== "DRAFT") {
            throw new ValidationError(
                "Solo se pueden editar movimientos en borrador."
            );
        }

        await this.validateReferences(data);

        return this.repository.update(
            BigInt(id),
            data
        );

    }

    async cancel(
        id: string
    ): Promise<InventoryMovement> {

        const movement = await this.repository.findById(
            BigInt(id)
        );

        if (!movement) {
            throw new NotFoundError(
                "Movimiento no encontrado."
            );
        }

        if (movement.status !== "DRAFT") {
            throw new ValidationError(
                "Solo se pueden cancelar movimientos en borrador."
            );
        }

        return this.repository.cancel(
            BigInt(id)
        );

    }

    async confirm(
        id: string
    ): Promise<InventoryMovement> {

        return prisma.$transaction(async (tx) => {

            const service = this.withTransaction(tx);

            const movement = await service.repository.findById(
                BigInt(id)
            );

            if (!movement) {
                throw new NotFoundError(
                    "Movimiento no encontrado."
                );
            }

            if (movement.status !== "DRAFT") {
                throw new ValidationError(
                    "El movimiento ya fue confirmado."
                );
            }

            const movementType = await service.movementTypeRepository.findById(
                movement.movementTypeId
            );

            if (!movementType) {
                throw new NotFoundError(
                    "El tipo de movimiento no existe."
                );
            }

            if (movementType.affectsStock) {

                switch (movementType.stockOperation) {

                    case "IN":

                        await service.inventoryStockService.increaseStock(
                            movement.productId,
                            movement.storeId,
                            movement.quantity
                        );

                        break;

                    case "OUT":

                        await service.inventoryStockService.decreaseStock(
                            movement.productId,
                            movement.storeId,
                            movement.quantity
                        );

                        if (movementType.code === "DAMAGE_OUT") {

                            await service.damagedStockService.increase(
                                movement.productId,
                                movement.storeId,
                                movement.quantity
                            );

                        }

                        break;

                    case "NONE":

                        break;

                }

            }

            return service.repository.confirm(
                BigInt(id)
            );

        });

    }

    async createWithTransaction(
        data: CreateInventoryMovementDto
    ): Promise<InventoryMovement> {

        const movementType =
            await this.movementTypeRepository.findById(
                BigInt(data.movementTypeId)
            );

        if (!movementType) {
            throw new NotFoundError(
                "El tipo de movimiento no existe."
            );
        }

        return this.createInternal(
            data,
            movementType
        );

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

    withTransaction(
        tx: Prisma.TransactionClient
    ): InventoryMovementService {

        return new InventoryMovementService(
            this.repository.withTransaction(tx),
            this.inventoryStockService.withTransaction(tx),
            this.damagedStockService.withTransaction(tx)
        );

    }
}

