export interface CreatePartCuttingOrderDto {
    number: string;
    partId: string;
    rawMaterialQtyUsed: number;
    userId: string;
    observations?: string;
}

export interface UpdatePartCuttingOrderDto {
    number: string;
    partId: string;
    rawMaterialQtyUsed: number;
    observations?: string;
}

export interface ConfirmPartCuttingOrderDto {
    goodPieces: number;
    defectivePieces?: number;
}
