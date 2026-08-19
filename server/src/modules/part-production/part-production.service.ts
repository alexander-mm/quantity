import { NotFoundError, ValidationError } from "../../shared/errors/index.js";
import { PartRepository } from "../part/part.repository.js";
import { PartComponentRepository } from "../part-component/part-component.repository.js";
import { PartComponentProductRepository } from "../part-component-product/part-component-product.repository.js";
import { PartRecipeRepository } from "../part-recipe/part-recipe.repository.js";
import { StoreRepository } from "../store/store.repository.js";
import { InventoryStockService } from "../inventory-stock/inventory-stock.service.js";

type RawMaterialResolution = {
    rawMaterialId: string;
    rawMaterialCode: string;
    rawMaterialName: string;
    piecesPerUnit: number;
    unitsRequired: number;
    unitsAvailable: number;
    unitsMissing: number;
};

type SubProductRequirement = {
    componentProductId: string;
    componentCode: string;
    componentName: string;
    recipeQuantity: number;
    requiredQuantity: number;
    available: number;
    missing: number;
    sufficient: boolean;
};

export type PartRequirementNode = {
    partId: string;
    partCode: string;
    partName: string;
    requiredQuantity: number;
    available: number;
    missing: number;
    sufficient: boolean;
    circular: boolean;
    hasRawMaterialOption: boolean;
    hasAssemblyOption: boolean;
    rawMaterial: RawMaterialResolution | null;
    subParts: PartRequirementNode[];
    subProducts: SubProductRequirement[];
    resolvable: boolean;
};

export class PartProductionService {

    private readonly partRepository = new PartRepository();
    private readonly componentRepository = new PartComponentRepository();
    private readonly componentProductRepository = new PartComponentProductRepository();
    private readonly partRecipeRepository = new PartRecipeRepository();
    private readonly storeRepository = new StoreRepository();
    private readonly inventoryStockService = new InventoryStockService();

    async preview(partId: string, quantity: number) {

        const part = await this.partRepository.findById(BigInt(partId));

        if (!part) {
            throw new NotFoundError("La pieza a producir no existe.");
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

        const tree = await this.resolveNode(
            part,
            quantity,
            new Set([partId]),
            mainWarehouse.id.toString(),
            false
        );

        return {
            part,
            quantity,
            tree,
            resolvable: tree.resolvable
        };

    }

    private async resolveNode(
        part: { id: bigint; code: string; name: string; quantity: unknown },
        requiredQuantity: number,
        visited: Set<string>,
        warehouseId: string,
        checkOwnStock: boolean
    ): Promise<PartRequirementNode> {

        const available = checkOwnStock ? Number(part.quantity) : 0;
        const missing = Math.max(0, requiredQuantity - available);
        const sufficient = missing === 0;

        let rawMaterial: RawMaterialResolution | null = null;
        const subParts: PartRequirementNode[] = [];
        const subProducts: SubProductRequirement[] = [];

        if (missing > 0) {

            const cuttingRecipe = await this.partRecipeRepository.findByPart(part.id);

            if (cuttingRecipe) {

                const piecesPerUnit = Number(cuttingRecipe.piecesPerUnit);
                const unitsRequired = missing / piecesPerUnit;
                const unitsAvailable = Number(cuttingRecipe.rawMaterial.quantity);

                rawMaterial = {
                    rawMaterialId: cuttingRecipe.rawMaterialId.toString(),
                    rawMaterialCode: cuttingRecipe.rawMaterial.code,
                    rawMaterialName: cuttingRecipe.rawMaterial.name,
                    piecesPerUnit,
                    unitsRequired,
                    unitsAvailable,
                    unitsMissing: Math.max(0, unitsRequired - unitsAvailable)
                };

            }

            const [components, componentProducts] = await Promise.all([
                this.componentRepository.findByPart(part.id),
                this.componentProductRepository.findByPart(part.id)
            ]);

            for (const item of components) {

                const componentPartId = item.componentPartId.toString();
                const subRequired = Number(item.quantity) * missing;

                if (visited.has(componentPartId)) {

                    subParts.push({
                        partId: componentPartId,
                        partCode: item.componentPart.code,
                        partName: item.componentPart.name,
                        requiredQuantity: subRequired,
                        available: 0,
                        missing: subRequired,
                        sufficient: false,
                        circular: true,
                        hasRawMaterialOption: false,
                        hasAssemblyOption: false,
                        rawMaterial: null,
                        subParts: [],
                        subProducts: [],
                        resolvable: false
                    });

                    continue;

                }

                const childVisited = new Set(visited);
                childVisited.add(componentPartId);

                const childNode = await this.resolveNode(
                    item.componentPart,
                    subRequired,
                    childVisited,
                    warehouseId,
                    true
                );

                subParts.push(childNode);

            }

            for (const item of componentProducts) {

                const requiredQuantity = Number(item.quantity) * missing;

                const stock = await this.inventoryStockService.findByProductAndStore(
                    item.componentProductId.toString(),
                    warehouseId
                );

                const productAvailable = stock ? Number(stock.quantity) : 0;

                subProducts.push({
                    componentProductId: item.componentProductId.toString(),
                    componentCode: item.componentProduct.internalCode,
                    componentName: item.componentProduct.name,
                    recipeQuantity: Number(item.quantity),
                    requiredQuantity,
                    available: productAvailable,
                    missing: Math.max(0, requiredQuantity - productAvailable),
                    sufficient: productAvailable >= requiredQuantity
                });

            }

        }

        const hasRawMaterialOption = rawMaterial !== null;
        const hasAssemblyOption = subParts.length > 0 || subProducts.length > 0;

        const rawMaterialResolvable = hasRawMaterialOption && rawMaterial!.unitsMissing === 0;
        const assemblyResolvable = hasAssemblyOption
            && subParts.every(item => item.resolvable)
            && subProducts.every(item => item.sufficient);

        return {
            partId: part.id.toString(),
            partCode: part.code,
            partName: part.name,
            requiredQuantity,
            available,
            missing,
            sufficient,
            circular: false,
            hasRawMaterialOption,
            hasAssemblyOption,
            rawMaterial,
            subParts,
            subProducts,
            resolvable: sufficient || rawMaterialResolvable || assemblyResolvable
        };

    }

}
