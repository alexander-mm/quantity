import type { Product } from "@/types";

export interface PartComponentProduct {
    id: string;
    uuid: string;
    partId: string;
    componentProductId: string;
    quantity: string;
    componentProduct: Product;
}