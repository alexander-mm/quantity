export interface CreatePartDto {
    code: string;
    name: string;
    description?: string;
    categoryId?: string;
    minimumStock?: number;
    cost: number;
    initialQuantity?: number;
    userId: string;
    weldingCost?: number;
    otherCostDescription?: string;
    otherCostAmount?: number;
}

export interface UpdatePartDto {
    code: string;
    name: string;
    description?: string;
    categoryId?: string;
    minimumStock?: number;
    cost: number;
    weldingCost?: number;
    otherCostDescription?: string;
    otherCostAmount?: number;
}
