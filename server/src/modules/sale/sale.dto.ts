export interface CreateSaleDetailDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
}

export interface CreateSaleDto {
    clientUuid?: string;
    number: string;
    clientId: string;
    storeId: string;
    userId: string;
    currency: "USD" | "COP";
    saleDate: Date;
    reference?: string;
    observations?: string;
    accountReceivableNumber?: string;
    details: CreateSaleDetailDto[];
}

export interface UpdateSaleDto {
    number: string;
    clientId: string;
    storeId: string;
    userId: string;
    currency: "USD" | "COP";
    saleDate: Date;
    reference?: string;
    observations?: string;
    status: "DRAFT" | "CONFIRMED" | "CANCELLED";
    details: CreateSaleDetailDto[];
}
