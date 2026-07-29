import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnitOfMeasure } from "@/services";

export function useCreateUnitOfMeasure() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createUnitOfMeasure,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units-of-measure"] });
        }
    });
}
