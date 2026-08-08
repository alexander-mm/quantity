import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "@/services";
import type { CreateCategoryRequest } from "@/services";

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateCategoryRequest }) =>
            updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        }
    });
}
