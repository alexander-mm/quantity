import { useQuery } from "@tanstack/react-query";
import { getReturns } from "@/services";

export function useReturns() {
    return useQuery({ queryKey: ["returns"], queryFn: getReturns });
}
