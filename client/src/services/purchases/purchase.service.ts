import { api } from "@/services/api";
import type {
    ApiResponse,
    Purchase
} from "@/types";

export async function getPurchases():
    Promise<ApiResponse<Purchase[]>>{

    const {data}=await api.get<
        ApiResponse<Purchase[]>
    >("/purchases");

    return data;

}

export async function getPurchaseById(
    id:string
):Promise<ApiResponse<Purchase>>{

    const {data}=await api.get<
        ApiResponse<Purchase>
    >(`/purchases/${id}`);

    return data;

}

export type CreatePurchaseRequest={

    number:string;
    supplierId:string;
    storeId:string;
    userId:string;

    purchaseDate:Date;

    reference?:string;
    observations?:string;

    details:{
        productId:string;
        quantity:number;
        unitCost:number;
        discount?:number;
        tax?:number;
    }[];

};

export async function createPurchase(
    payload:CreatePurchaseRequest
):Promise<ApiResponse<Purchase>>{

    const {data}=await api.post<
        ApiResponse<Purchase>
    >(
        "/purchases",
        payload
    );

    return data;

}

export async function confirmPurchase(
    id:string
):Promise<ApiResponse<Purchase>>{

    const {data}=await api.post<
        ApiResponse<Purchase>
    >(
        `/purchases/${id}/confirm`
    );

    return data;

}

export async function cancelPurchase(
    id:string
):Promise<ApiResponse<void>>{

    const {data}=await api.delete<
        ApiResponse<void>
    >(
        `/purchases/${id}`
    );

    return data;

}