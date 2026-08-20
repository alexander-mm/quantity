import type { RawMaterial } from "@/types";

export type PartRecipeCostInputs = {
    piecesPerUnit?: number;
    laserMeters?: number;
    usesMechanicalCut?: boolean;
    bendCount?: number;
    curveCount?: number;
    weldingCost?: number;
    otherCostAmount?: number;
};

export function calculatePartCost(rawMaterial: RawMaterial, recipe: PartRecipeCostInputs): number {

    const baseCost = rawMaterial.cost !== null ? Number(rawMaterial.cost) : 0;
    const wasteFactor = 1 + (rawMaterial.wastePercentage !== null ? Number(rawMaterial.wastePercentage) / 100 : 0);
    const piecesPerUnit = recipe.piecesPerUnit || 1;

    const materialCost = (baseCost * wasteFactor) / piecesPerUnit;

    const laserCost = (recipe.laserMeters && rawMaterial.laserCostPerMeter !== null)
        ? recipe.laserMeters * Number(rawMaterial.laserCostPerMeter)
        : 0;

    const mechanicalCutCost = (recipe.usesMechanicalCut && rawMaterial.mechanicalCutCost !== null)
        ? Number(rawMaterial.mechanicalCutCost)
        : 0;

    const bendCost = (recipe.bendCount && rawMaterial.bendCostPerBend !== null)
        ? recipe.bendCount * Number(rawMaterial.bendCostPerBend)
        : 0;

    const curveCost = (recipe.curveCount && rawMaterial.curveCostPerCurve !== null)
        ? recipe.curveCount * Number(rawMaterial.curveCostPerCurve)
        : 0;

    const weldingCost = recipe.weldingCost ?? 0;
    const otherCost = recipe.otherCostAmount ?? 0;

    const total = materialCost + laserCost + mechanicalCutCost + bendCost + curveCost + weldingCost + otherCost;

    return Math.round(total * 100) / 100;

}
