import type { Client } from "@/types";

export type QuoteCurrency = "USD" | "COP";

export interface QuoteDetail {
    id: string;
    quantity: string;
    unitPrice: string;
    discount: string;
    tax: string;
    lineTotal: string;
    product: {
        id: string;
        internalCode: string;
        name: string;
    };
}

export interface Quote {
    id: string;
    uuid: string;
    number: string;
    currency: QuoteCurrency;
    quoteDate: string;
    validUntil: string | null;
    observations: string | null;
    subtotal: string;
    discount: string;
    tax: string;
    total: string;
    createdAt: string;
    client: Client;
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
    convertedSale: {
        id: string;
        number: string;
    } | null;
    details: QuoteDetail[];
}
