import { useQuery } from "@tanstack/react-query";

import { getMarginProfiles } from "@/services";

export function useMarginProfiles() {

    return useQuery({

        queryKey: ["margin-profiles"],

        queryFn: getMarginProfiles

    });

}