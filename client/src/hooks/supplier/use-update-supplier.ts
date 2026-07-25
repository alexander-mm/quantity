import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    updateSupplier
} from "@/services";

import type {
    SupplierFormData
} from "@/validators";

export function useUpdateSupplier() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({
            id,
            data
        }: {
            id: string;
            data: SupplierFormData;
        }) =>
            updateSupplier(
                id,
                data
            ),

        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({

                queryKey: ["suppliers"]

            });

            queryClient.invalidateQueries({

                queryKey: ["supplier", variables.id]

            });

        }

    });

}