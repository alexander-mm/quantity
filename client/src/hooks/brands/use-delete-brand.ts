import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBrand } from "@/services";

export function useDeleteBrand() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        }
    });
}
