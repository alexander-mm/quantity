export interface SetPartRecipeDto {
    rawMaterialId: string;
    pieceWidth?: number;
    pieceHeight?: number;
    pieceLength?: number;
    // Se carga desde la ficha de la Pieza, no desde este formulario. Si se omite en un
    // update, el valor existente no se toca (ver PartRecipeRepository.upsert).
    piecesPerUnit?: number;

    // Costeo de producción: cuánto de cada operación consume esta pieza puntual (soldadura
    // y "otro" viven en Part, no acá, porque no dependen de ninguna materia prima).
    laserMeters?: number;
    usesMechanicalCut?: boolean;
    bendCount?: number;
    curveCount?: number;
}
