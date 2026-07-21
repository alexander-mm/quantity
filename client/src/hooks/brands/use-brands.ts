import { useQuery } from "@tanstack/react-query";

import { getBrands } from "@/services";

export function useBrands() {

    return useQuery({

        queryKey: ["brands"],

        queryFn: getBrands

    });

}