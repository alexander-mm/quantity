export type TransferStatus = "DRAFT" | "PENDING" | "RECEIVED" | "WITH_ISSUES" | "CANCELLED";
export type TransferDestinationType = "STORE" | "TECHNICIAN";

export interface StockTransferDetail {
    id: string;
    quantitySent: string;
    quantityReceived: string | null;
    product: { id: string; name: string; };
}

export interface StockTransfer {
    id: string;
    number: string;
    status: TransferStatus;
    destType: TransferDestinationType;
    dispatchDate: string;
    receivedAt: string | null;
    observations: string | null;
    createdAt: string;
    originStore: { id: string; name: string; };
    destStore: { id: string; name: string; } | null;
    destUser: { id: string; firstName: string; lastName: string; } | null;
    user: { id: string; firstName: string; lastName: string; };
    details: StockTransferDetail[];
}
