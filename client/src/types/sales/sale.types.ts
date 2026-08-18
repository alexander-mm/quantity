import type { Client } from "@/types"

export type PaymentMethod = "CASH" | "TRANSFER" | "CREDIT";

export interface SaleTransferVoucher {
    id: string;
    number: string;
}

export interface SaleAccountReceivable {
    id: string;
    number: string;
    originalAmount: string;
    amount: string;
    downPayment: string;
    downPaymentMethod: "CASH" | "TRANSFER" | null;
    termDays: number | null;
    dueDate: string | null;
    downPaymentVouchers: { id: string; number: string }[];
}

export interface Sale{

    id:string;
    number:string;
    status:string;
    currency:"USD"|"COP";
    paymentMethod: PaymentMethod;
    saleDate:string;
    reference:string|null;
    observations:string|null;
    createdAt:string;

    subtotal:string;
    discount:string;
    tax:string;
    hasShipping:boolean;
    shippingCost:string;
    hasLabor:boolean;
    laborCost:string;
    total:string;

    client: Client;

    store:{
        id:string;
        name:string;
    };

    user:{
        id:string;
        firstName:string;
        lastName:string;
    };

    details:SaleDetail[];

    transferVouchers: SaleTransferVoucher[];
    accountReceivable: SaleAccountReceivable | null;

}

export interface SaleDetail{

    id:string;

    quantity:string;
    unitPrice:string;

    discount:string;
    tax:string;
    lineTotal:string;

    product:{
        id:string;
        name:string;
    };

}
