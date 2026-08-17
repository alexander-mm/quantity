export interface PurchaseDetailPriceEntryDto {
    currency: "USD" | "COP";
    sequence: number;
    price: number;
}

export interface CreatePurchaseDetailDto {
    productId: string;
    quantity: number;
    unitCost: number;
    pvp: number;
    pvpCop?: number;
    priceEntries?: PurchaseDetailPriceEntryDto[];
    discount?: number;
    tax?: number;
}

export interface CreatePurchaseDto {
    number: string;
    supplierId: string;
    storeId: string;
    userId: string;
    purchaseDate: Date;
    reference?: string;
    observations?: string;
    details: CreatePurchaseDetailDto[];
}

export type UpdatePurchaseDto = CreatePurchaseDto;