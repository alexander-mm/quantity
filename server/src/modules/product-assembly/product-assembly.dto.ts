export interface CreateProductAssemblyDto {
    number: string;
    productId: string;
    quantity: number;
    userId: string;
    observations?: string;
}

export interface UpdateProductAssemblyDto {
    number: string;
    productId: string;
    quantity: number;
    observations?: string;
}
