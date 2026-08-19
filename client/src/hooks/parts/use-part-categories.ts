import { useQuery } from "@tanstack/react-query";

import { getPartCategories } from "@/services";

export function usePartCategories() {

    return useQuery({

        queryKey: ["part-categories"],

        queryFn: getPartCategories

    });

}
