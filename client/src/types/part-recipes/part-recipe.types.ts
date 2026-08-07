import type { RawMaterial } from "@/types";

export interface PartRecipe {
    id: string;
    uuid: string;
    partId: string;
    rawMaterialId: string;
    pieceWidth: string | null;
    pieceHeight: string | null;
    pieceLength: string | null;
    piecesPerUnit: string;
    isActive: boolean;
    rawMaterial: RawMaterial;
}
