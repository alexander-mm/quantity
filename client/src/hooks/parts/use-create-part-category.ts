import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPartCategory } from "@/services";

export function useCreatePartCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPartCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-categories"] });
        }
    });
}
