export interface CreateRawMaterialMovementDetailDto {
    rawMaterialId: string;
    quantity: number;
}

export interface CreateRawMaterialMovementDto {
    number: string;
    type: "IN" | "OUT";
    userId: string;
    movementDate: Date;
    observations?: string;
    cuttingOrderId?: string;
    details: CreateRawMaterialMovementDetailDto[];
}
