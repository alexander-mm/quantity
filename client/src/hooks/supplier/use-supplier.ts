import { useQuery } from "@tanstack/react-query";

import { getSupplierById } from "@/services";

export function useSupplier(
    id?: string
) {

    return useQuery({

        queryKey: ["supplier", id],

        queryFn: () => getSupplierById(id!),

        enabled: !!id

    });

}