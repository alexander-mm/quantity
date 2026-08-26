import { useQuery } from "@tanstack/react-query";
import { getQuoteById } from "@/services";

export function useQuote(id?: string) {
    return useQuery({
        queryKey: ["quotes", id],
        queryFn: () => getQuoteById(id as string),
        enabled: !!id
    });
}
