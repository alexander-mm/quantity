import type { Client, Sale } from "@/types";

export interface AccountReceivable {
    id: string;
    uuid: string;
    number: string;
    clientId: string;
    saleId: string;
    amount: string;
    currency: "USD" | "COP";
    isPaid: boolean;
    paidAt: string | null;
    observations: string | null;
    createdAt: string;
    updatedAt: string;
    client: Client;
    sale: Sale;
}

export interface WholesalerCreditSummary {
    clientId: string;
    currency: "USD" | "COP";
    total: number;
}
