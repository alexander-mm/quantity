import { useQuery } from "@tanstack/react-query";
import { getKardex } from "@/services";

export function useKardex(
    productId?: string,
    storeId?: string
) {
    return useQuery({
        queryKey: [
            "kardex",
            productId,
            storeId
        ],
        queryFn: () =>
            getKardex(
                productId!,
                storeId!
            ),
        enabled: !!productId && !!storeId
    });
}