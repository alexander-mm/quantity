export type ReturnReason =
    | "DAMAGED"
    | "CUSTOMER_CHANGED_MIND"
    | "WRONG_ITEM"
    | "INCOMPATIBLE"
    | "WARRANTY"
    | "OTHER";

export type ReturnStatus = "PENDING_REVIEW" | "RESOLVED";
export type ReturnDisposition = "RESTOCK" | "DAMAGED";

export interface Return {
    id: string;
    number: string;
    quantity: string;
    reason: ReturnReason;
    notes: string | null;
    status: ReturnStatus;
    disposition: ReturnDisposition | null;
    returnDate: string;
    resolvedAt: string | null;
    sale: { id: string; number: string } | null;
    saleDetail: { id: string; unitPrice: string } | null;
    product: { id: string; internalCode: string; name: string };
    store: { id: string; name: string };
    user: { id: string; firstName: string; lastName: string };
    resolver: { id: string; firstName: string; lastName: string } | null;
}
