export interface CreateAccountReceivableDto {
    number: string;
    clientId: bigint;
    saleId: bigint;
    amount: number;
    currency: "USD" | "COP";
}

export interface UpdateAccountReceivableDto {
    number: string;
    observations?: string;
}
