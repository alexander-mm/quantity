import { useQuery } from "@tanstack/react-query";

import { getKitAvailability } from "@/services";

export function useKitAvailability(storeId?: string) {

    return useQuery({

        queryKey: ["kit-availability", storeId],

        queryFn: () => getKitAvailability(storeId!),

        enabled: !!storeId

    });

}
