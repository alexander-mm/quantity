export interface ProductPriceEntryItemDto {
    currency: "USD" | "COP";
    sequence: number;
    price: number;
}

export interface ReplaceProductPriceEntriesDto {
    entries: ProductPriceEntryItemDto[];
}
