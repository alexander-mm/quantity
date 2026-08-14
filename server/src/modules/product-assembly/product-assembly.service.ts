import { Prisma } from "@prisma/client";

import { prisma } from "../../database/index.js";
import { ConflictError, NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { ProductRepository } from "../product/product.repository.js";
import { ProductComponentRepository } from "../product-component/product-component.repository.js";
import { EquipmentPartRepository } from "../equipment-part/equipment-part.repository.js";
import { PartRepository } from "../part/part.repository.js";
import { PartMovementRepository } from "../part-movement/part-movement.repository.js";
import { StoreRepository } from "../store/store.repository.js";
import { MovementTypeRepository } from "../movement-type/movement-type.repository.js";
import { InventoryStockService } from "../inventory-stock/inventory-stock.service.js";
import { InventoryMovementService } from "../inventory-movement/inventory-movement.service.js";

import { ProductAssemblyRepository } from "./product-assembly.repository.js";
import { CreateProductAssemblyDto, UpdateProductAssemblyDto } from "./product-assembly.dto.js";

export class ProductAssemblyService {

    private readonly repository = new ProductAssemblyRepository();
    private readonly productRepository = new ProductRepository();
    private readonly componentRepository = new ProductComponentRepository();
    private readonly equipmentPartRepository = new EquipmentPartRepository();
    private readonly partRepository = new PartRepository();
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
            throw new NotFoundError("Ensamblaje no encontrado.");
        }

        return assembly;

    }

    async preview(productId: string, quantity: number) {

        const product = await this.productRepository.findById(BigInt(productId));

        if (!product) {
            throw new NotFoundError("El producto a ensamblar no existe.");
        }

        const [recipe, partsRecipe] = await Promise.all([
            this.componentRepository.findByProduct(BigInt(productId)),
            this.equipmentPartRepository.findByProduct(BigInt(productId))
        ]);

        if (recipe.length === 0 && partsRecipe.length === 0) {
            throw new ValidationError("Este producto no tiene una receta de componentes ni de piezas definida.");
        }

        const mainWarehouse = await this.storeRepository.findMainWarehouse();

        if (!mainWarehouse) {
            throw new NotFoundError("No existe una bodega principal configurada.");
        }

        const requiredByComponent = await Promise.all(recipe.map(async item => {

            const requiredQuantity = Number(item.quantity) * quantity;

            const stock = await this.inventoryStockService.findByProductAndStore(
                item.componentProductId.toString(),
                mainWarehouse.id.toString()
            );

            const available = stock ? Number(stock.quantity) : 0;

            return {
                componentProductId: item.componentProductId,
                componentName: item.componentProduct.name,
                componentCode: item.componentProduct.internalCode,
                costPrice: item.componentProduct.costPrice,
                recipeQuantity: Number(item.quantity),
                requiredQuantity,
                available,
                sufficient: available >= requiredQuantity
            };

        }));

        const requiredByPart = partsRecipe.map(item => {

            const requiredQuantity = Number(item.quantity) * quantity;
            const available = Number(item.part.quantity);

            return {
                partId: item.partId,
                partCode: item.part.code,
                partName: item.part.name,
                recipeQuantity: Number(item.quantity),
                requiredQuantity,
                available,
                sufficient: available >= requiredQuantity
            };

        });

        return {
            product,
            mainWarehouse,
            components: requiredByComponent,
            parts: requiredByPart,
            canAssemble: requiredByComponent.every(item => item.sufficient)
                && requiredByPart.every(item => item.sufficient)
        };

    }

    private async buildAssemblySnapshot(productId: string, quantity: number) {

        const product = await this.productRepository.findById(BigInt(productId));

        if (!product) {
            throw new NotFoundError("El producto a ensamblar no existe.");
        }

        const [recipe, partsRecipe] = await Promise.all([
            this.componentRepository.findByProduct(BigInt(productId)),
            this.equipmentPartRepository.findByProduct(BigInt(productId))
        ]);

        if (recipe.length === 0 && partsRecipe.length === 0) {
            throw new ValidationError("Este producto no tiene una receta de componentes ni de piezas definida.");
        }

        return {
            components: recipe.map(item => ({
                componentProductId: item.componentProductId,
                quantity: Number(item.quantity) * quantity
            })),
            parts: partsRecipe.map(item => ({
                partId: item.partId,
                quantity: Number(item.quantity) * quantity
            }))
        };

    }

    async create(data: CreateProductAssemblyDto) {

        const existing = await this.repository.findByNumber(data.number);

        if (existing) {
            throw new ConflictError("Ya existe un ensamblaje con ese número.");
        }

        const preview = await this.preview(data.productId, data.quantity);

        if (!preview.canAssemble) {
            throw new ValidationError(
                "No hay stock suficiente para ensamblar esta cantidad. Ajusta la cantidad o espera a que llegue el stock."
            );
        }

        const { components, parts } = await this.buildAssemblySnapshot(data.productId, data.quantity);

        return this.repository.create(data, components, parts);

    }

    async update(id: string, data: UpdateProductAssemblyDto) {

        const assembly = await this.repository.findById(BigInt(id));

        if (!assembly) {
            throw new NotFoundError("Ensamblaje no encontrado.");
        }

        if (assembly.status !== "DRAFT") {
            throw new ValidationError("Solo se pueden editar ensamblajes en borrador.");
        }

        const existing = await this.repository.findByNumber(data.number);

        if (existing && existing.id !== assembly.id) {
            throw new ConflictError("Ya existe un ensamblaje con ese número.");
        }

        const preview = await this.preview(data.productId, data.quantity);

        if (!preview.canAssemble) {
            throw new ValidationError(
                "No hay stock suficiente para ensamblar esta cantidad. Ajusta la cantidad o espera a que llegue el stock."
            );
        }

        const { components, parts } = await this.buildAssemblySnapshot(data.productId, data.quantity);

        return this.repository.update(assembly.id, data, components, parts);

    }

    async cancel(id: string) {

        const assembly = await this.repository.findById(BigInt(id));

        if (!assembly) {
            throw new NotFoundError("Ensamblaje no encontrado.");
        }

        if (assembly.status !== "DRAFT") {
            throw new ValidationError("Solo se pueden eliminar ensamblajes en borrador.");
        }

        return this.repository.updateStatus(assembly.id, "CANCELLED");

    }

    async confirm(id: string, userId: string) {

        const assembly = await this.repository.findById(BigInt(id));

        if (!assembly) {
            throw new NotFoundError("Ensamblaje no encontrado.");
        }

        if (assembly.status !== "DRAFT") {
            throw new ValidationError("Este ensamblaje ya fue procesado.");
        }

        const mainWarehouse = await this.storeRepository.findMainWarehouse();

        if (!mainWarehouse) {
            throw new NotFoundError("No existe una bodega principal configurada.");
        }

        for (const detail of assembly.details) {

            const stock = await this.inventoryStockService.findByProductAndStore(
                detail.componentProductId.toString(),
                mainWarehouse.id.toString()
            );

            const available = stock ? Number(stock.quantity) : 0;
            const required = Number(detail.quantity);

            if (available < required) {
                throw new ValidationError(
                    `Stock insuficiente de "${detail.componentProduct.name}" en bodega principal: disponible ${available}, requerido ${required}.`
                );
            }

        }

        for (const partDetail of assembly.partDetails) {

            const available = Number(partDetail.part.quantity);
            const required = Number(partDetail.quantity);

            if (available < required) {
                throw new ValidationError(
                    `Stock insuficiente de la pieza "${partDetail.part.name}": disponible ${available}, requerido ${required}.`
                );
            }

        }

        const assemblyInType = await this.movementTypeRepository.findByCode("ASSEMBLY_IN");
        const assemblyOutType = await this.movementTypeRepository.findByCode("ASSEMBLY_OUT");

        if (!assemblyInType || !assemblyOutType) {
            throw new NotFoundError("No existen los tipos de movimiento de ensamblaje.");
        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);
            const movementService = this.inventoryMovementService.withTransaction(tx);
            const partRepository = this.partRepository.withTransaction(tx);
            const partMovementRepository = this.partMovementRepository.withTransaction(tx);

            for (const detail of assembly.details) {

                await movementService.createWithTransaction({
                    movementTypeId: assemblyOutType.id,
                    productId: detail.componentProductId,
                    storeId: mainWarehouse.id,
                    userId: BigInt(userId),
                    quantity: new Prisma.Decimal(detail.quantity),
                    unitCost: detail.componentProduct.costPrice,
                    observations: `Ensamblaje ${assembly.number}: consumo de "${detail.componentProduct.name}"`,
                    movementDate: new Date()
                });

            }

            if (assembly.partDetails.length > 0) {

                await partMovementRepository.create({
                    number: `ENSAMBLAJE-${assembly.number}`,
                    type: "OUT",
                    userId,
                    movementDate: new Date(),
                    observations: `Ensamblaje ${assembly.number}: consumo de piezas para "${assembly.product.name}"`,
                    details: assembly.partDetails.map(partDetail => ({
                        partId: partDetail.partId.toString(),
                        quantity: Number(partDetail.quantity)
                    }))
                });

                for (const partDetail of assembly.partDetails) {

                    await partRepository.decrementQuantity(
                        partDetail.partId,
                        new Prisma.Decimal(partDetail.quantity)
                    );

                }

            }

            await movementService.createWithTransaction({
                movementTypeId: assemblyInType.id,
                productId: assembly.productId,
                storeId: mainWarehouse.id,
                userId: BigInt(userId),
                quantity: assembly.quantity,
                unitCost: assembly.product.costPrice,
                observations: `Ensamblaje ${assembly.number}`,
                movementDate: new Date()
            });

            return repository.updateStatus(assembly.id, "CONFIRMED");

        });

    }

}
