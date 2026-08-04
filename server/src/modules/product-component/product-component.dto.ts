export interface ProductComponentItemDto {
    componentProductId: string;
    quantity: number;
}

export interface SetProductComponentsDto {
    components: ProductComponentItemDto[];
}
