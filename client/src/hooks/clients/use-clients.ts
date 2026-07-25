import { useQuery } from "@tanstack/react-query";

import { getClients } from "@/services";

export function useClients() {

    return useQuery({

        queryKey: ["clients"],

        queryFn: getClients

    });

}
