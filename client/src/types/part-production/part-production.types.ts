import type { Part } from "@/types";

export interface PartProductionRawMaterial {
    rawMaterialId: string;
    rawMaterialCode: string;
    rawMaterialName: string;
    piecesPerUnit: number;
    unitsRequired: number;
    unitsAvailable: number;
    unitsMissing: number;
}

export interface PartProductionSubProduct {
    componentProductId: string;
    componentCode: string;
    componentName: string;
    recipeQuantity: number;
    requiredQuantity: number;
    available: number;
    missing: number;
    sufficient: boolean;
}

export interface PartProductionNode {
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
    rawMaterial: PartProductionRawMaterial | null;
    subParts: PartProductionNode[];
    subProducts: PartProductionSubProduct[];
    resolvable: boolean;
}

export interface PartProductionPreview {
    part: Part;
    quantity: number;
    tree: PartProductionNode;
    resolvable: boolean;
}
