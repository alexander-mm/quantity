export interface PartComponentProductItemDto {
    componentProductId: string;
    quantity: number;
}

export interface SetPartComponentProductsDto {
    products: PartComponentProductItemDto[];
}