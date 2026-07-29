import { api } from "@/services/api";
import type { ApiResponse, User } from "@/types";

export async function getUsers(): Promise<ApiResponse<User[]>> {
    const { data } = await api.get<ApiResponse<User[]>>("/users");
    return data;
}

export type CreateUserRequest = {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    roleId: number;
    storeId: number;
};

export async function createUser(
    payload: CreateUserRequest
): Promise<ApiResponse<User>> {
    const { data } = await api.post<ApiResponse<User>>(
        "/users",
        payload
    );
    return data;
}

export async function getUserById(id: string): Promise<ApiResponse<User>> {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
    return data;
}

export type UpdateUserRequest = {
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    roleId: number;
    storeId: number;
};

export async function updateUser(
    id: string,
    payload: UpdateUserRequest
): Promise<ApiResponse<User>> {
    const { data } = await api.put<ApiResponse<User>>(
        `/users/${id}`,
        payload
    );
    return data;
}

export async function deleteUser(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/users/${id}`);
    return data;
}