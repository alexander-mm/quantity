import type { RawMaterial } from "@/types";

export interface PartRecipe {
    id: string;
    uuid: string;
    partId: string;
    rawMaterialId: string;
    pieceWidth: string | null;
    pieceHeight: string | null;
    pieceLength: string | null;
    // Se carga desde la ficha de la Pieza — puede no estar definido todavía.
    piecesPerUnit: string | null;
    isActive: boolean;
    rawMaterial: RawMaterial;

    // Costeo de producción: cuánto de cada operación consume esta pieza puntual (soldadura
    // y "otro" viven en Part, no acá, porque no dependen de ninguna materia prima).
    laserMeters: string | null;
    usesMechanicalCut: boolean;
    bendCount: string | null;
    curveCount: string | null;
}
