import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setPartComponents } from "@/services";
import type { SetPartComponentsRequest } from "@/services";

export function useSetPartComponents() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ partId, data }: { partId: string; data: SetPartComponentsRequest }) =>
            setPartComponents(partId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["part-components", variables.partId] });
            queryClient.invalidateQueries({ queryKey: ["part-components", "with-recipe"] });
        }
    });
}