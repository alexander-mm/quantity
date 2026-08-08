export interface CreatePartDto {
    code: string;
    name: string;
    description?: string;
    minimumStock?: number;
    initialQuantity?: number;
    userId: string;
}

export interface UpdatePartDto {
    code: string;
    name: string;
    description?: string;
    minimumStock?: number;
}
