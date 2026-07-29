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