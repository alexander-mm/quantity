export interface CreateStockTransferDetailDto {
    productId: string;
    quantitySent: number;
}

export interface CreateStockTransferDto {
    number: string;
    originStoreId: string;
    destType: "STORE" | "TECHNICIAN";
    destStoreId?: string;
    destUserId?: string;
    userId: string;
    dispatchDate: Date;
    observations?: string;
    details: CreateStockTransferDetailDto[];
}

export interface ReportIssueDetailDto {
    productId: string;
    quantityReceived: number;
}

export interface ReportIssueStockTransferDto {
    observations: string;
    details: ReportIssueDetailDto[];
}

export interface ResolveStockTransferDto {
    details: ReportIssueDetailDto[];
}