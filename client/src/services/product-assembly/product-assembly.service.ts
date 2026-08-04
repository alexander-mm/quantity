import { api } from "@/services/api";
import type { ApiResponse, ProductAssembly, ProductAssemblyPreview } from "@/types";

export async function getProductAssemblies(): Promise<ApiResponse<ProductAssembly[]>> {
    const { data } = await api.get<ApiResponse<ProductAssembly[]>>("/product-assemblies");
    return data;
}

export async function getProductAssemblyById(id: string): Promise<ApiResponse<ProductAssembly>> {
    const { data } = await api.get<ApiResponse<ProductAssembly>>(`/product-assemblies/${id}`);
    return data;
}

export async function getProductAssemblyPreview(
    productId: string,
    quantity: number
): Promise<ApiResponse<ProductAssemblyPreview>> {
    const { data } = await api.get<ApiResponse<ProductAssemblyPreview>>(
        `/product-assemblies/preview/${productId}`,
        { params: { quantity } }
    );
    return data;
}

export type CreateProductAssemblyRequest = {
    number: string;
    productId: string;
    quantity: number;
    observations?: string;
};

export type UpdateProductAssemblyRequest = CreateProductAssemblyRequest;

export async function createProductAssembly(
    payload: CreateProductAssemblyRequest
): Promise<ApiResponse<ProductAssembly>> {
    const { data } = await api.post<ApiResponse<ProductAssembly>>("/product-assemblies", payload);
    return data;
}

export async function updateProductAssembly(
    id: string,
    payload: UpdateProductAssemblyRequest
): Promise<ApiResponse<ProductAssembly>> {
    const { data } = await api.put<ApiResponse<ProductAssembly>>(`/product-assemblies/${id}`, payload);
    return data;
}

export async function confirmProductAssembly(id: string): Promise<ApiResponse<ProductAssembly>> {
    const { data } = await api.post<ApiResponse<ProductAssembly>>(`/product-assemblies/${id}/confirm`);
    return data;
}

export async function deleteProductAssembly(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/product-assemblies/${id}`);
    return data;
}
