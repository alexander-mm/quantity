import { api } from "@/services/api";
import type { ApiResponse, WeeklyReport } from "@/types";

export async function getWeeklyReports(): Promise<ApiResponse<WeeklyReport[]>> {
    const { data } = await api.get<ApiResponse<WeeklyReport[]>>("/weekly-reports");
    return data;
}

export async function getWeeklyReportPdfBlob(id: string): Promise<Blob> {
    const { data } = await api.get(`/weekly-reports/${id}/pdf`, { responseType: "blob" });
    return data;
}

export async function generateCustomWeeklyReport(payload: { from: string; to: string }): Promise<ApiResponse<WeeklyReport>> {
    const { data } = await api.post<ApiResponse<WeeklyReport>>("/weekly-reports/custom", payload);
    return data;
}
