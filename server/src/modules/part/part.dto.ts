export interface CreatePartDto {
    code: string;
    name: string;
    description?: string;
    categoryId?: string;
    minimumStock?: number;
    cost: number;
    initialQuantity?: number;
    userId: string;
}

export interface UpdatePartDto {
    code: string;
    name: string;
    description?: string;
    categoryId?: string;
    minimumStock?: number;
    cost: number;
}
