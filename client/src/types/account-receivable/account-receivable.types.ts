import type { Client, Sale, PaymentMethodEntry } from "@/types";

export interface AccountReceivableDownPaymentVoucher {
    id: string;
    number: string;
}

export interface AccountReceivablePaymentVoucher {
    id: string;
    number: string;
}

export interface AccountReceivablePayment {
    id: string;
    amount: string;
    paymentMethods: PaymentMethodEntry[];
    paymentDate: string;
    observations: string | null;
    createdAt: string;
    vouchers: AccountReceivablePaymentVoucher[];
}

export interface AccountReceivable {
    id: string;
    uuid: string;
    number: string;
    clientId: string;
    saleId: string;
    originalAmount: string;
    amount: string;
    currency: "USD" | "COP";
    downPayment: string;
    downPaymentMethods: PaymentMethodEntry[];
    termDays: number | null;
    dueDate: string | null;
    isPaid: boolean;
    paidAt: string | null;
    observations: string | null;
    createdAt: string;
    updatedAt: string;
    client: Client;
    sale: Sale;
    downPaymentVouchers: AccountReceivableDownPaymentVoucher[];
    payments: AccountReceivablePayment[];
}

export interface AccountReceivableSummary {
    clientId: string;
    currency: "USD" | "COP";
    total: number;
}
