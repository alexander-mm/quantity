import { api } from "@/services/api";
import type { ApiResponse, Product, ProductPrice, ProductPriceEntry } from "@/types";
import type { ProductFormData } from "@/validators";

export async function getProducts(): Promise<ApiResponse<Product[]>> {
    const { data } = await api.get<ApiResponse<Product[]>>("/products");
    return data;
}

export type KitAvailability = {
    productId: string;
    quantity: number;
};

export async function getKitAvailability(
    storeId: string
): Promise<ApiResponse<KitAvailability[]>> {

    const { data } = await api.get<ApiResponse<KitAvailability[]>>(
        "/products/kit-availability",
        { params: { storeId } }
    );

    return data;

}

export async function getProductById(
    id: string
): Promise<ApiResponse<ProductFormData>> {

    const { data } = await api.get<ApiResponse<ProductFormData>>(
        `/products/${id}`
    );

    return data;

}

export type CreateProductRequest = {

    internalCode: string;
    barcode?: string;
    name: string;
    description?: string;
    brand: string;
    categoryId: string;
    unitOfMeasure: string;
    costPrice: number;
    pvp: number;
    pvpCop?: number;
    minimumStock: number;
    assembleOnSale?: boolean;
};

export async function createProduct(
    payload: CreateProductRequest
): Promise<ApiResponse<Product>> {

    const request = {
        ...payload,
        categoryId: Number(payload.categoryId)
    };

    const { data } = await api.post<ApiResponse<Product>>(
        "/products",
        request
    );

    return data;

}

export type UpdateProductRequest = {
    internalCode: string;
    barcode?: string;
    name: string;
    description?: string;
    brand: string;
    categoryId: string;
    unitOfMeasure: string;
    costPrice: number;
    pvp: number;
    pvpCop?: number;
    minimumStock: number;
    assembleOnSale?: boolean;
};

export async function updateProduct(
    id: string,
    payload: UpdateProductRequest
): Promise<ApiResponse<Product>> {

    const request = {
        ...payload,
        categoryId: Number(payload.categoryId)
    };

    const { data } = await api.put<ApiResponse<Product>>(
        `/products/${id}`,
        request
    );
    return data;
}

export async function updateProductMinimumStock(
    id: string,
    minimumStock: number
): Promise<ApiResponse<Product>> {
    const { data } = await api.patch<ApiResponse<Product>>(
        `/products/${id}/minimum-stock`,
        { minimumStock }
    );
    return data;
}

export async function deleteProduct(
    id: string
): Promise<void> {

    await api.delete(
        `/products/${id}`
    );

}

export async function getProductPrices(
    productId: string
): Promise<ApiResponse<ProductPrice[]>> {

    const { data } = await api.get<ApiResponse<ProductPrice[]>>(
        `/product-prices/${productId}`
    );

    return data;

}

export async function getProductPriceEntries(
    productId: string
): Promise<ApiResponse<ProductPriceEntry[]>> {

    const { data } = await api.get<ApiResponse<ProductPriceEntry[]>>(
        `/product-price-entries/${productId}`
    );

    return data;

}

export type PriceEntryLabel = {
    currency: "USD" | "COP";
    sequence: number;
    label: string;
};

export async function getProductPriceEntryLabels(): Promise<ApiResponse<PriceEntryLabel[]>> {

    const { data } = await api.get<ApiResponse<PriceEntryLabel[]>>(
        "/product-price-entries/labels"
    );

    return data;

}

export type ReplaceProductPriceEntriesRequest = {
    entries: {
        currency: "USD" | "COP";
        sequence: number;
        price: number;
    }[];
};

export async function replaceProductPriceEntries(
    productId: string,
    payload: ReplaceProductPriceEntriesRequest
): Promise<ApiResponse<ProductPriceEntry[]>> {

    const { data } = await api.put<ApiResponse<ProductPriceEntry[]>>(
        `/product-price-entries/${productId}`,
        payload
    );

    return data;

}