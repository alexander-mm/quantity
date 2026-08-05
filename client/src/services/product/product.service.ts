import { api } from "@/services/api";
import type { ApiResponse, Product, ProductPrice } from "@/types";
import type { ProductFormData } from "@/validators";

export async function getProducts(): Promise<ApiResponse<Product[]>> {
    const { data } = await api.get<ApiResponse<Product[]>>("/products");
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