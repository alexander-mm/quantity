import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportStockTransferIssue } from "@/services";
import type { ReportIssueRequest } from "@/services";

export function useReportStockTransferIssue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ReportIssueRequest }) =>
            reportStockTransferIssue(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
        }
    });
}
