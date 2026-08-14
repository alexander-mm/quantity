import { Prisma } from "@prisma/client";

import { prisma } from "../../database/index.js";
import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { PartRepository } from "../part/part.repository.js";
import { PartComponentRepository } from "../part-component/part-component.repository.js";
import { PartComponentProductRepository } from "../part-component-product/part-component-product.repository.js";
import { PartMovementRepository } from "../part-movement/part-movement.repository.js";
import { StoreRepository } from "../store/store.repository.js";
import { MovementTypeRepository } from "../movement-type/movement-type.repository.js";
import { InventoryStockService } from "../inventory-stock/inventory-stock.service.js";
import { InventoryMovementService } from "../inventory-movement/inventory-movement.service.js";

import { PartAssemblyRepository } from "./part-assembly.repository.js";
import { CreatePartAssemblyDto, UpdatePartAssemblyDto } from "./part-assembly.dto.js";

export class PartAssemblyService {

    private readonly repository = new PartAssemblyRepository();
    private readonly partRepository = new PartRepository();
    private readonly componentRepository = new PartComponentRepository();
    private readonly componentProductRepository = new PartComponentProductRepository();
    private readonly partMovementRepository = new PartMovementRepository();
    private readonly storeRepository = new StoreRepository();
    private readonly movementTypeRepository = new MovementTypeRepository();
    private readonly inventoryStockService = new InventoryStockService();
    private readonly inventoryMovementService = new InventoryMovementService();

    async findAll() {
        return this.repository.findAll();
    }

    async findById(id: string) {

        const assembly = await this.repository.findById(BigInt(id));

        if (!assembly) {
            throw new NotFoundError("Ensamblaje de pieza no encontrado.");
        }

        return assembly;

    }

    async preview(partId: string, quantity: number) {

        const part = await this.partRepository.findById(BigInt(partId));

        if (!part) {
            throw new NotFoundError("La pieza a ensamblar no existe.");
        }

        const [recipe, productsRecipe] = await Promise.all([
            this.componentRepository.findByPart(BigInt(partId)),
            this.componentProductRepository.findByPart(BigInt(partId))
        ]);

        if (recipe.length === 0 && productsRecipe.length === 0) {
            throw new ValidationError("Esta pieza no tiene una receta de piezas ni de productos definida.");
        }

        const mainWarehouse = await this.storeRepository.findMainWarehouse();

        if (!mainWarehouse) {
            throw new NotFoundError("No existe una bodega principal configurada.");
        }

        const requiredByComponent = recipe.map(item => {

            const requiredQuantity = Number(item.quantity) * quantity;
            const available = Number(item.componentPart.quantity);

            return {
                componentPartId: item.componentPartId,
                componentCode: item.componentPart.code,
                componentName: item.componentPart.name,
                recipeQuantity: Number(item.quantity),
                requiredQuantity,
                available,
                sufficient: available >= requiredQuantity
            };

        });

        const requiredByProduct = await Promise.all(productsRecipe.map(async item => {

            const requiredQuantity = Number(item.quantity) * quantity;

            const stock = await this.inventoryStockService.findByProductAndStore(
                item.componentProductId.toString(),
                mainWarehouse.id.toString()
            );

            const available = stock ? Number(stock.quantity) : 0;

            return {
                componentProductId: item.componentProductId,
                componentCode: item.componentProduct.internalCode,
                componentName: item.componentProduct.name,
                recipeQuantity: Number(item.quantity),
                requiredQuantity,
                available,
                sufficient: available >= requiredQuantity
            };

        }));

        return {
            part,
            mainWarehouse,
            components: requiredByComponent,
            products: requiredByProduct,
            canAssemble: requiredByComponent.every(item => item.sufficient)
                && requiredByProduct.every(item => item.sufficient)
        };

    }

    private async buildAssemblySnapshot(partId: string, quantity: number) {

        const part = await this.partRepository.findById(BigInt(partId));

        if (!part) {
            throw new NotFoundError("La pieza a ensamblar no existe.");
        }

        const [recipe, productsRecipe] = await Promise.all([
            this.componentRepository.findByPart(BigInt(partId)),
            this.componentProductRepository.findByPart(BigInt(partId))
        ]);

        if (recipe.length === 0 && productsRecipe.length === 0) {
            throw new ValidationError("Esta pieza no tiene una receta de piezas ni de productos definida.");
        }

        return {
            components: recipe.map(item => ({
                componentPartId: item.componentPartId,
                quantity: Number(item.quantity) * quantity
            })),
            products: productsRecipe.map(item => ({
                componentProductId: item.componentProductId,
                quantity: Number(item.quantity) * quantity
            }))
        };

    }

    async create(data: CreatePartAssemblyDto) {

        const existing = await this.repository.findByNumber(data.number);

        if (existing) {
            throw new ConflictError("Ya existe un ensamblaje con ese número.");
        }

        const preview = await this.preview(data.partId, data.quantity);

        if (!preview.canAssemble) {
            throw new ValidationError(
                "No hay stock suficiente para ensamblar esta cantidad. Ajusta la cantidad o espera a que llegue el stock."
            );
        }

        const { components, products } = await this.buildAssemblySnapshot(data.partId, data.quantity);

        return this.repository.create(data, components, products);

    }

    async update(id: string, data: UpdatePartAssemblyDto) {

        const assembly = await this.repository.findById(BigInt(id));

        if (!assembly) {
            throw new NotFoundError("Ensamblaje de pieza no encontrado.");
        }

        if (assembly.status !== "DRAFT") {
            throw new ValidationError("Solo se pueden editar ensamblajes en borrador.");
        }

        const existing = await this.repository.findByNumber(data.number);

        if (existing && existing.id !== assembly.id) {
            throw new ConflictError("Ya existe un ensamblaje con ese número.");
        }

        const preview = await this.preview(data.partId, data.quantity);

        if (!preview.canAssemble) {
            throw new ValidationError(
                "No hay stock suficiente para ensamblar esta cantidad. Ajusta la cantidad o espera a que llegue el stock."
            );
        }

        const { components, products } = await this.buildAssemblySnapshot(data.partId, data.quantity);

        return this.repository.update(assembly.id, data, components, products);

    }

    async cancel(id: string) {

        const assembly = await this.repository.findById(BigInt(id));

        if (!assembly) {
            throw new NotFoundError("Ensamblaje de pieza no encontrado.");
        }

        if (assembly.status !== "DRAFT") {
            throw new ValidationError("Solo se pueden eliminar ensamblajes en borrador.");
        }

        return this.repository.updateStatus(assembly.id, "CANCELLED");

    }

    async confirm(id: string, userId: string) {

        const assembly = await this.repository.findById(BigInt(id));

        if (!assembly) {
            throw new NotFoundError("Ensamblaje de pieza no encontrado.");
        }

        if (assembly.status !== "DRAFT") {
            throw new ValidationError("Este ensamblaje ya fue procesado.");
        }

        const mainWarehouse = await this.storeRepository.findMainWarehouse();

        if (!mainWarehouse) {
            throw new NotFoundError("No existe una bodega principal configurada.");
        }

        for (const detail of assembly.details) {

            const available = Number(detail.componentPart.quantity);
            const required = Number(detail.quantity);

            if (available < required) {
                throw new ValidationError(
                    `Stock insuficiente de la pieza "${detail.componentPart.name}": disponible ${available}, requerido ${required}.`
                );
            }

        }

        for (const productDetail of assembly.productDetails) {

            const stock = await this.inventoryStockService.findByProductAndStore(
                productDetail.componentProductId.toString(),
                mainWarehouse.id.toString()
            );

            const available = stock ? Number(stock.quantity) : 0;
            const required = Number(productDetail.quantity);

            if (available < required) {
                throw new ValidationError(
                    `Stock insuficiente de "${productDetail.componentProduct.name}" en bodega principal: disponible ${available}, requerido ${required}.`
                );
            }

        }

        const assemblyOutType = await this.movementTypeRepository.findByCode("ASSEMBLY_OUT");

        if (!assemblyOutType) {
            throw new NotFoundError("No existe el tipo de movimiento de ensamblaje.");
        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const movementService = this.inventoryMovementService.withTransaction(tx);
            const partRepository = this.partRepository.withTransaction(tx);
            const partMovementRepository = this.partMovementRepository.withTransaction(tx);

            // 1) Piezas consumidas (si la receta tiene): un PartMovement OUT con todos los detalles.
            if (assembly.details.length > 0) {

                await partMovementRepository.create({
                    number: `ENSAMBLAJE-${assembly.number}-OUT`,
                    type: "OUT",
                    userId,
                    movementDate: new Date(),
                    observations: `Ensamblaje ${assembly.number}: consumo de piezas para "${assembly.part.name}"`,
                    details: assembly.details.map(detail => ({
                        partId: detail.componentPartId.toString(),
                        quantity: Number(detail.quantity)
                    }))
                });

                for (const detail of assembly.details) {

                    await partRepository.decrementQuantity(
                        detail.componentPartId,
                        new Prisma.Decimal(detail.quantity)
                    );

                }

            }

            // 2) Productos consumidos (si la receta tiene): un InventoryMovement ASSEMBLY_OUT por cada uno.
            for (const productDetail of assembly.productDetails) {

                await movementService.createWithTransaction({
                    movementTypeId: assemblyOutType.id,
                    productId: productDetail.componentProductId,
                    storeId: mainWarehouse.id,
                    userId: BigInt(userId),
                    quantity: new Prisma.Decimal(productDetail.quantity),
                    unitCost: productDetail.componentProduct.costPrice,
                    observations: `Ensamblaje ${assembly.number}: consumo de "${productDetail.componentProduct.name}"`,
                    movementDate: new Date()
                });

            }

            // 3) Pieza producida: SIEMPRE un PartMovement IN aparte (no puede compartir número/registro con el OUT del paso 1).
            await partMovementRepository.create({
                number: `ENSAMBLAJE-${assembly.number}-IN`,
                type: "IN",
                userId,
                movementDate: new Date(),
                observations: `Ensamblaje ${assembly.number}: producción de "${assembly.part.name}"`,
                details: [{
                    partId: assembly.partId.toString(),
                    quantity: Number(assembly.quantity)
                }]
            });

            await partRepository.incrementQuantity(
                assembly.partId,
                new Prisma.Decimal(assembly.quantity)
            );

            return repository.updateStatus(assembly.id, "CONFIRMED");

        });

    }

}