import { prisma } from "../../database/index.js";
import { NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { ProductRepository } from "../product/product.repository.js";
import { PartRepository } from "../part/part.repository.js";
import { PartRecipeRepository } from "../part-recipe/part-recipe.repository.js";

import { EquipmentPartRepository } from "./equipment-part.repository.js";
import { SetEquipmentPartsDto } from "./equipment-part.dto.js";

export class EquipmentPartService {

    private readonly repository = new EquipmentPartRepository();
    private readonly productRepository = new ProductRepository();
    private readonly partRepository = new PartRepository();
    private readonly partRecipeRepository = new PartRecipeRepository();

    async findByProduct(productId: string) {
        return this.repository.findByProduct(BigInt(productId));
    }

    async preview(productId: string, quantity: number) {

        const product = await this.productRepository.findById(BigInt(productId));

        if (!product) {
            throw new NotFoundError("El equipo no existe.");
        }

        const recipe = await this.repository.findByProduct(BigInt(productId));

        if (recipe.length === 0) {
            throw new ValidationError("Este equipo no tiene una receta de piezas definida.");
        }

        const parts = await Promise.all(recipe.map(async item => {

            const requiredQuantity = Number(item.quantity) * quantity;
            const available = Number(item.part.quantity);
            const missing = Math.max(0, requiredQuantity - available);

            let rawMaterial: {
                rawMaterialId: string;
                rawMaterialCode: string;
                rawMaterialName: string;
                piecesPerUnit: number;
                unitsAvailable: number;
                unitsRequired: number;
                unitsMissing: number;
            } | null = null;

            if (missing > 0) {

                const partRecipe = await this.partRecipeRepository.findByPart(item.partId);

                if (partRecipe) {

                    const piecesPerUnit = Number(partRecipe.piecesPerUnit);
                    const unitsRequired = missing / piecesPerUnit;
                    const unitsAvailable = Number(partRecipe.rawMaterial.quantity);

                    rawMaterial = {
                        rawMaterialId: partRecipe.rawMaterialId.toString(),
                        rawMaterialCode: partRecipe.rawMaterial.code,
                        rawMaterialName: partRecipe.rawMaterial.name,
                        piecesPerUnit,
                        unitsAvailable,
                        unitsRequired,
                        unitsMissing: Math.max(0, unitsRequired - unitsAvailable)
                    };

                }

            }

            return {
                partId: item.partId.toString(),
                partCode: item.part.code,
                partName: item.part.name,
                recipeQuantity: Number(item.quantity),
                requiredQuantity,
                available,
                missing,
                sufficient: missing === 0,
                hasCuttingRecipe: rawMaterial !== null || missing === 0,
                rawMaterial
            };

        }));

        return {
            product,
            quantity,
            parts,
            canProduceFromPartStock: parts.every(item => item.sufficient),
            canProduceWithRawMaterial: parts.every(item =>
                item.sufficient || (item.rawMaterial !== null && item.rawMaterial.unitsMissing === 0)
            )
        };

    }

    async set(productId: string, data: SetEquipmentPartsDto) {

        const product = await this.productRepository.findById(BigInt(productId));

        if (!product) {
            throw new NotFoundError("Producto no encontrado.");
        }

        const seen = new Set<string>();

        for (const item of data.parts) {

            if (seen.has(item.partId)) {
                throw new ValidationError("No puede repetir la misma pieza en la receta.");
            }

            seen.add(item.partId);

            const part = await this.partRepository.findById(BigInt(item.partId));

            if (!part) {
                throw new NotFoundError("Una de las piezas seleccionadas no existe.");
            }

        }

        return prisma.$transaction(async (tx) => {

            const repository = this.repository.withTransaction(tx);

            await repository.deleteByProduct(BigInt(productId));

            return repository.createMany(BigInt(productId), data);

        });

    }

}
