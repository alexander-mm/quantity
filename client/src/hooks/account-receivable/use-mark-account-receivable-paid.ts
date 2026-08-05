import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAccountReceivablePaid } from "@/services";

export function useMarkAccountReceivablePaid() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: markAccountReceivablePaid,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts-receivable"] });
        }
    });
}
