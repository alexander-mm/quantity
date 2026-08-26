export interface CreateQuoteDetailDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
}

export interface CreateQuoteDto {
    number: string;
    clientId: string;
    userId: string;
    currency: "USD" | "COP";
    quoteDate: Date;
    validUntil?: Date;
    observations?: string;
    details: CreateQuoteDetailDto[];
}

export type UpdateQuoteDto = Omit<CreateQuoteDto, "userId">;

export interface ConvertQuoteDto {
    saleId: string;
}
