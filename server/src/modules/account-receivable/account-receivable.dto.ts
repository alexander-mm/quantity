export interface PaymentMethodEntryDto {
    method: "CASH" | "TRANSFER";
    amount: number;
}

export interface CreateAccountReceivableDto {
    number: string;
    clientId: bigint;
    saleId: bigint;
    originalAmount: number;
    amount: number;
    currency: "USD" | "COP";
    downPayment?: number;
    downPaymentMethods?: PaymentMethodEntryDto[];
    downPaymentVouchers?: string[];
    termDays?: number;
    dueDate?: Date;
}

export interface UpdateAccountReceivableDto {
    number: string;
    observations?: string;
}

export interface CreateAccountReceivablePaymentDto {
    amount: number;
    paymentMethods: PaymentMethodEntryDto[];
    paymentDate: Date;
    vouchers?: string[];
    observations?: string;
}
