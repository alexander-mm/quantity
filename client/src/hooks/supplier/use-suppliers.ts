import { useQuery } from "@tanstack/react-query";

import { getSuppliers } from "@/services";

export function useSuppliers() {

    return useQuery({

        queryKey: ["suppliers"],

        queryFn: getSuppliers

    });

}