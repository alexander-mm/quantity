import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePart } from "@/services";

export function useDeletePart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["parts"] });
        }
    });
}
