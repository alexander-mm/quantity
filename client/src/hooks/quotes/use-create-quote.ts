import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuote } from "@/services";

export function useCreateQuote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createQuote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotes"] });
        }
    });
}
