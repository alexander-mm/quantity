export interface SetPartRecipeDto {
    rawMaterialId: string;
    pieceWidth?: number;
    pieceHeight?: number;
    pieceLength?: number;
    piecesPerUnit: number;

    // Costeo de producción: cuánto de cada operación consume esta pieza puntual (soldadura
    // y "otro" viven en Part, no acá, porque no dependen de ninguna materia prima).
    laserMeters?: number;
    usesMechanicalCut?: boolean;
    bendCount?: number;
    curveCount?: number;
}
