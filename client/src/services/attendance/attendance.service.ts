import { api } from "@/services/api";
import type {
    ApiResponse,
    AttendanceFilters,
    AttendanceRecord,
    ClockResult,
    KioskContext
} from "@/types";

export async function getKioskContext(): Promise<ApiResponse<KioskContext>> {
    const { data } = await api.get<ApiResponse<KioskContext>>("/attendance/kiosk-context");
    return data;
}

export async function clockAttendance(payload: {
    userId: string;
    pin: string;
}): Promise<ApiResponse<ClockResult>> {
    const { data } = await api.post<ApiResponse<ClockResult>>("/attendance/clock", payload);
    return data;
}

export async function getAttendanceHistory(
    filters: AttendanceFilters
): Promise<ApiResponse<AttendanceRecord[]>> {
    const { data } = await api.get<ApiResponse<AttendanceRecord[]>>("/attendance", {
        params: filters
    });
    return data;
}

export async function setAttendancePin(
    userId: string,
    pin: string
): Promise<ApiResponse<{ id: string; firstName: string; lastName: string }>> {
    const { data } = await api.put<ApiResponse<{ id: string; firstName: string; lastName: string }>>(
        `/attendance/pin/${userId}`,
        { pin }
    );
    return data;
}
