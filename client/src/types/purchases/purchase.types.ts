import type { Supplier } from "@/types"

export interface Purchase{

    id:string;
    number:string;
    status:string;
    purchaseDate:string;
    reference:string|null;
    observations:string|null;

    subtotal:string;
    discount:string;
    tax:string;
    total:string;

    supplier: Supplier;

    store:{
        id:string;
        name:string;
    };

    user:{
        id:string;
        firstName:string;
        lastName:string;
    };

    details:PurchaseDetail[];

}

export interface PurchaseDetailPriceEntry{
    id:string;
    currency:"USD"|"COP";
    sequence:number;
    price:string;
}

export interface PurchaseDetail{

    id:string;

    quantity:string;
    unitCost:string;
    pvp:string|null;
    pvpCop:string|null;
    priceEntries:PurchaseDetailPriceEntry[];

    discount:string;
    tax:string;
    lineTotal:string;

    product:{
        id:string;
        name:string;
    };

}