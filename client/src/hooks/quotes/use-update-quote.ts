import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuote } from "@/services";
import type { UpdateQuoteRequest } from "@/services";

export function useUpdateQuote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateQuoteRequest }) => updateQuote(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotes"] });
        }
    });
}
