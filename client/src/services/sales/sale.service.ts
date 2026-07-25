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

export async function getSaleById(
    id:string
):Promise<ApiResponse<Sale>>{

    const {data}=await api.get<
        ApiResponse<Sale>
    >(`/sales/${id}`);

    return data;

}

export type CreateSaleRequest={

    number:string;
    clientId:string;
    storeId:string;
    userId:string;

    saleDate:Date;

    reference?:string;
    observations?:string;

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
