import { api } from "@/services/api";
import type { ApiResponse, Supplier } from "@/types";
import type { SupplierFormData } from "@/validators";

export async function getSuppliers(): Promise<ApiResponse<Supplier[]>> {

    const { data } = await api.get<ApiResponse<Supplier[]>>(
        "/suppliers"
    );

    return data;

}

export async function getSupplierById(
    id: string
): Promise<ApiResponse<SupplierFormData>> {

    const { data } = await api.get<ApiResponse<SupplierFormData>>(
        `/suppliers/${id}`
    );

    return data;

}

export async function createSupplier(
    payload: SupplierFormData
): Promise<ApiResponse<Supplier>> {

    const { data } = await api.post<ApiResponse<Supplier>>(
        "/suppliers",
        payload
    );

    return data;

}

export async function updateSupplier(
    id: string,
    payload: SupplierFormData
): Promise<ApiResponse<Supplier>> {

    const { data } = await api.put<ApiResponse<Supplier>>(
        `/suppliers/${id}`,
        payload
    );

    return data;

}

export async function deleteSupplier(
    id: string
): Promise<void> {

    await api.delete(
        `/suppliers/${id}`
    );

}