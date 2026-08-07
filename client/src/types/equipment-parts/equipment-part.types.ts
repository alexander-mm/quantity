import type { Part, Product } from "@/types";

export interface EquipmentPart {
    id: string;
    uuid: string;
    productId: string;
    partId: string;
    quantity: string;
    part: Part;
}

export interface EquipmentPartPreviewRawMaterial {
    rawMaterialId: string;
    rawMaterialCode: string;
    rawMaterialName: string;
    piecesPerUnit: number;
    unitsAvailable: number;
    unitsRequired: number;
    unitsMissing: number;
}

export interface EquipmentPartPreviewPart {
    partId: string;
    partCode: string;
    partName: string;
    recipeQuantity: number;
    requiredQuantity: number;
    available: number;
    missing: number;
    sufficient: boolean;
    hasCuttingRecipe: boolean;
    rawMaterial: EquipmentPartPreviewRawMaterial | null;
}

export interface EquipmentPartPreview {
    product: Product;
    quantity: number;
    parts: EquipmentPartPreviewPart[];
    canProduceFromPartStock: boolean;
    canProduceWithRawMaterial: boolean;
}
