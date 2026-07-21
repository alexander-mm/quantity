import { useQuery } from "@tanstack/react-query";

import { getUnitsOfMeasure } from "@/services";

export function useUnitsOfMeasure() {

    return useQuery({

        queryKey: ["units-of-measure"],

        queryFn: getUnitsOfMeasure

    });

}