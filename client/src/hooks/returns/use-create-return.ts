import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReturn } from "@/services";

export function useCreateReturn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createReturn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["returns"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
        }
    });
}
