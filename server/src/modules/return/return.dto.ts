export type ReturnReason =
    | "DAMAGED"
    | "CUSTOMER_CHANGED_MIND"
    | "WRONG_ITEM"
    | "INCOMPATIBLE"
    | "WARRANTY"
    | "FACTORY_DEFECT"
    | "OTHER";

export type ReturnDisposition = "RESTOCK" | "DAMAGED";

export interface CreateReturnDto {
    clientUuid?: string;
    number: string;
    saleId?: string;
    saleDetailId?: string;
    assemblyId?: string;
    productId?: string;
    partId?: string;
    storeId: string;
    quantity: number;
    reason: ReturnReason;
    notes?: string;
    returnDate: Date;
    disposition?: ReturnDisposition;
    userId: string;
}

export interface ResolveReturnDto {
    disposition: ReturnDisposition;
    userId: string;
}
