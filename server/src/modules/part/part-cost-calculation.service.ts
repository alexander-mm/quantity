import { Prisma } from "@prisma/client";

import { PartRepository } from "./part.repository.js";
import { PartRecipeRepository } from "../part-recipe/part-recipe.repository.js";

type RawMaterialCostFields = {
    cost: Prisma.Decimal | null;
    wastePercentage: Prisma.Decimal | null;
    laserCostPerMeter: Prisma.Decimal | null;
    mechanicalCutCost: Prisma.Decimal | null;
    bendCostPerBend: Prisma.Decimal | null;
    curveCostPerCurve: Prisma.Decimal | null;
};

type PartRecipeCostFields = {
    piecesPerUnit: Prisma.Decimal | null;
    laserMeters: Prisma.Decimal | null;
    usesMechanicalCut: boolean;
    bendCount: Prisma.Decimal | null;
    curveCount: Prisma.Decimal | null;
    rawMaterial: RawMaterialCostFields;
};

type PartAdditionalCostFields = {
    weldingCost: Prisma.Decimal | null;
    otherCostAmount: Prisma.Decimal | null;
};

function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

export class PartCostCalculationService {

    private readonly partRepository = new PartRepository();
    private readonly partRecipeRepository = new PartRecipeRepository();

    calculate(recipe: PartRecipeCostFields, part: PartAdditionalCostFields): number {

        const rawMaterial = recipe.rawMaterial;

        const baseCost = rawMaterial.cost ? Number(rawMaterial.cost) : 0;
        const wasteFactor = 1 + (rawMaterial.wastePercentage ? Number(rawMaterial.wastePercentage) / 100 : 0);
        const piecesPerUnit = Number(recipe.piecesPerUnit) || 1;

        const materialCost = (baseCost * wasteFactor) / piecesPerUnit;

        const laserCost = (recipe.laserMeters && rawMaterial.laserCostPerMeter)
            ? Number(recipe.laserMeters) * Number(rawMaterial.laserCostPerMeter)
            : 0;

        const mechanicalCutCost = (recipe.usesMechanicalCut && rawMaterial.mechanicalCutCost)
            ? Number(rawMaterial.mechanicalCutCost)
            : 0;

        const bendCost = (recipe.bendCount && rawMaterial.bendCostPerBend)
            ? Number(recipe.bendCount) * Number(rawMaterial.bendCostPerBend)
            : 0;

        const curveCost = (recipe.curveCount && rawMaterial.curveCostPerCurve)
            ? Number(recipe.curveCount) * Number(rawMaterial.curveCostPerCurve)
            : 0;

        const weldingCost = part.weldingCost ? Number(part.weldingCost) : 0;
        const otherCost = part.otherCostAmount ? Number(part.otherCostAmount) : 0;

        return round2(
            materialCost + laserCost + mechanicalCutCost + bendCost + curveCost + weldingCost + otherCost
        );

    }

    async recalculateForPart(partId: bigint): Promise<void> {

        const recipe = await this.partRecipeRepository.findByPart(partId);

        if (!recipe) {
            return;
        }

        const part = await this.partRepository.findById(partId);

        if (!part) {
            return;
        }

        const cost = this.calculate(recipe, part);

        await this.partRepository.update(partId, { cost });

    }

    async recalculateForRawMaterial(rawMaterialId: bigint): Promise<void> {

        const recipes = await this.partRecipeRepository.findByRawMaterial(rawMaterialId);

        for (const recipe of recipes) {

            const part = await this.partRepository.findById(recipe.partId);

            if (!part) {
                continue;
            }

            const cost = this.calculate(recipe, part);

            await this.partRepository.update(recipe.partId, { cost });

        }

    }

}
