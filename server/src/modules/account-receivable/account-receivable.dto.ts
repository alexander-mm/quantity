export interface CreateAccountReceivableDto {
    number: string;
    clientId: bigint;
    saleId: bigint;
    originalAmount: number;
    amount: number;
    currency: "USD" | "COP";
    downPayment?: number;
    downPaymentMethod?: "CASH" | "TRANSFER";
    downPaymentVouchers?: string[];
    termDays?: number;
    dueDate?: Date;
}

export interface UpdateAccountReceivableDto {
    number: string;
    observations?: string;
}
