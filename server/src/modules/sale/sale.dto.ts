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
    // Asignado por el servidor (consecutivo por tienda); se ignora si el cliente lo envía.
    number?: string;
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
    // De solo lectura una vez creada la venta: el servidor lo ignora en update.
    number?: string;
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
