import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveReturn } from "@/services";
import type { ReturnDisposition } from "@/types";

export function useResolveReturn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, disposition }: { id: string; disposition: ReturnDisposition }) =>
            resolveReturn(id, disposition),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["returns"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-stock"] });
        }
    });
}
