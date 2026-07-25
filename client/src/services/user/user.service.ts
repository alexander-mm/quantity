import { api } from "@/services/api";
import type { ApiResponse, User } from "@/types";

export async function getUsers(): Promise<ApiResponse<User[]>> {
    const { data } = await api.get<ApiResponse<User[]>>("/users");
    return data;
}