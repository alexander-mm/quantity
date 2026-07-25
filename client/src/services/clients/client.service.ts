import { api } from "@/services/api";
import type { ApiResponse, Client } from "@/types";

export async function getClients():
    Promise<ApiResponse<Client[]>>{

    const {data}=await api.get<
        ApiResponse<Client[]>
    >("/clients");

    return data;

}
