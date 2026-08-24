import { api } from "@/services/api";
import type {
    ApiResponse,
    Sale
} from "@/types";

export async function getSales():
    Promise<ApiResponse<Sale[]>>{

    const {data}=await api.get<
        ApiResponse<Sale[]>
    >("/sales");

    return data;

}

export async function getNextSaleNumber(
    storeId:string
):Promise<ApiResponse<{number:string}>>{

    const {data}=await api.get<
        ApiResponse<{number:string}>
    >(`/sales/next-number/${storeId}`);

    return data;

}

export async function getSaleById(
    id:string
):Promise<ApiResponse<Sale>>{

    const {data}=await api.get<
        ApiResponse<Sale>
    >(`/sales/${id}`);

    return data;

}

export type CreateSaleRequest={

    clientUuid:string;
    // Asignado por el servidor: consecutivo por tienda, de solo lectura.
    number?:string;
    clientId:string;
    storeId:string;
    userId:string;
    currency:"USD"|"COP";

    saleDate:Date;

    reference?:string;
    observations?:string;

    hasShipping?:boolean;
    shippingCost?:number;
    hasLabor?:boolean;
    laborCost?:number;

    paymentMethod:"CASH"|"TRANSFER"|"CREDIT";
    transferVouchers?:string[];

    accountReceivableNumber?:string;
    downPayment?:number;
    downPaymentMethod?:"CASH"|"TRANSFER";
    downPaymentVouchers?:string[];
    termDays?:number;

    details:{
        productId:string;
        quantity:number;
        unitPrice:number;
        discount?:number;
        tax?:number;
    }[];

};

export async function createSale(
    payload:CreateSaleRequest
):Promise<ApiResponse<Sale>>{

    const {data}=await api.post<
        ApiResponse<Sale>
    >(
        "/sales",
        payload
    );

    return data;

}

export type UpdateSaleRequest=Omit<CreateSaleRequest,"clientUuid"> & {
    status:"DRAFT"|"CONFIRMED"|"CANCELLED";
};

export async function updateSale(
    id:string,
    payload:UpdateSaleRequest
):Promise<ApiResponse<Sale>>{

    const {data}=await api.put<
        ApiResponse<Sale>
    >(
        `/sales/${id}`,
        payload
    );

    return data;

}

export async function confirmSale(
    id:string
):Promise<ApiResponse<Sale>>{

    const {data}=await api.post<
        ApiResponse<Sale>
    >(
        `/sales/${id}/confirm`
    );

    return data;

}

export async function cancelSale(
    id:string
):Promise<ApiResponse<void>>{

    const {data}=await api.delete<
        ApiResponse<void>
    >(
        `/sales/${id}`
    );

    return data;

}
