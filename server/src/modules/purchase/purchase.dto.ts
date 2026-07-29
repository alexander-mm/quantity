export interface CreatePurchaseDetailDto {
    productId: string;
    quantity: number;
    unitCost: number;
    pvp: number;
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

export interface UpdatePurchaseDto {
    number: string;
    supplierId: string;
    storeId: string;
    userId: string;
    purchaseDate: Date;
    reference?: string;
    observations?: string;
    status: "DRAFT" | "CONFIRMED" | "CANCELLED";
    details: CreatePurchaseDetailDto[];
}