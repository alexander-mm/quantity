import { useMutation, useQueryClient } from "@tanstack/react-query";
import { convertQuote } from "@/services";

export function useConvertQuote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, saleId }: { id: string; saleId: string }) => convertQuote(id, saleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotes"] });
        }
    });
}
