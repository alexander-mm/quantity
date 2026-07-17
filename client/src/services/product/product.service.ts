import { api } from "@/services/api";

export async function getProducts() {

    const { data } = await api.get("/products");

    return data;

}