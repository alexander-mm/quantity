import type { Client, Sale, PaymentMethod } from "@/types";

export interface AccountReceivableDownPaymentVoucher {
    id: string;
    number: string;
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
    downPaymentMethod: PaymentMethod | null;
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
}

export interface AccountReceivableSummary {
    clientId: string;
    currency: "USD" | "COP";
    total: number;
}
