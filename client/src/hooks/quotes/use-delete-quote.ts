import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuote } from "@/services";

export function useDeleteQuote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteQuote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotes"] });
        }
    });
}
