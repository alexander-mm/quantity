export interface CreateSaleDetailDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
}

export type PaymentMethodDto = "CASH" | "TRANSFER" | "CREDIT";

export interface CreateSaleDto {
    clientUuid?: string;
    number: string;
    clientId: string;
    storeId: string;
    userId: string;
    currency: "USD" | "COP";
    saleDate: Date;
    reference?: string;
    observations?: string;
    details: CreateSaleDetailDto[];

    hasShipping?: boolean;
    shippingCost?: number;
    hasLabor?: boolean;
    laborCost?: number;

    paymentMethod: PaymentMethodDto;

    // paymentMethod === "TRANSFER"
    transferVouchers?: string[];

    // paymentMethod === "CREDIT"
    accountReceivableNumber?: string;
    downPayment?: number;
    downPaymentMethod?: "CASH" | "TRANSFER";
    downPaymentVouchers?: string[];
    termDays?: number;
}

export interface UpdateSaleDto {
    number: string;
    clientId: string;
    storeId: string;
    userId: string;
    currency: "USD" | "COP";
    saleDate: Date;
    reference?: string;
    observations?: string;
    status: "DRAFT" | "CONFIRMED" | "CANCELLED";
    details: CreateSaleDetailDto[];

    hasShipping?: boolean;
    shippingCost?: number;
    hasLabor?: boolean;
    laborCost?: number;

    paymentMethod: PaymentMethodDto;
    transferVouchers?: string[];

    accountReceivableNumber?: string;
    downPayment?: number;
    downPaymentMethod?: "CASH" | "TRANSFER";
    downPaymentVouchers?: string[];
    termDays?: number;
}
