import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPart } from "@/services";

export function useCreatePart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["parts"] });
            queryClient.invalidateQueries({ queryKey: ["part-movements"] });
        }
    });
}
