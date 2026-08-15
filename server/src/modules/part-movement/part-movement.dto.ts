export interface CreatePartMovementDetailDto {
    partId: string;
    quantity: number;
}

export interface CreatePartMovementDto {
    number: string;
    type: "IN" | "OUT";
    userId: string;
    cuttingOrderId?: string;
    movementDate: Date;
    observations?: string;
    isAdjustment?: boolean;
    details: CreatePartMovementDetailDto[];
}
