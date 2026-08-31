import { api } from "@/services/api";
import type { ApiResponse, Quote, QuoteCurrency } from "@/types";

export type QuoteDetailRequest = {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
};

export type CreateQuoteRequest = {
    number: string;
    clientId: string;
    currency: QuoteCurrency;
    quoteDate: Date;
    validUntil?: Date;
    observations?: string;
    details: QuoteDetailRequest[];
    hasShipping?: boolean;
    shippingCost?: number;
    hasAdditionalCost?: boolean;
    additionalCost?: number;
};

export type UpdateQuoteRequest = CreateQuoteRequest;

export async function getQuotes(): Promise<ApiResponse<Quote[]>> {
    const { data } = await api.get<ApiResponse<Quote[]>>("/quotes");
    return data;
}

export async function getQuoteById(id: string): Promise<ApiResponse<Quote>> {
    const { data } = await api.get<ApiResponse<Quote>>(`/quotes/${id}`);
    return data;
}

export async function createQuote(payload: CreateQuoteRequest): Promise<ApiResponse<Quote>> {
    const { data } = await api.post<ApiResponse<Quote>>("/quotes", payload);
    return data;
}

export async function updateQuote(id: string, payload: UpdateQuoteRequest): Promise<ApiResponse<Quote>> {
    const { data } = await api.put<ApiResponse<Quote>>(`/quotes/${id}`, payload);
    return data;
}

export async function deleteQuote(id: string): Promise<ApiResponse<null>> {
    const { data } = await api.delete<ApiResponse<null>>(`/quotes/${id}`);
    return data;
}

export async function convertQuote(id: string, saleId: string): Promise<ApiResponse<Quote>> {
    const { data } = await api.post<ApiResponse<Quote>>(`/quotes/${id}/convert`, { saleId });
    return data;
}
