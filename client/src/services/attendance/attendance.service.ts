import { api } from "@/services/api";
import { getAttendanceDeviceToken } from "@/lib/attendance-device-token";
import type {
    ApiResponse,
    AttendanceDevice,
    AttendanceEnrollStore,
    AttendanceFilters,
    AttendanceRecord,
    ClockResult,
    EnrollAttendanceDevicePayload,
    KioskContext
} from "@/types";

// El servidor reconoce al reloj checador por el token del equipo autorizado (o por IP).
function deviceHeaders(): Record<string, string> {
    const token = getAttendanceDeviceToken();
    return token ? { "X-Attendance-Device-Token": token } : {};
}

export async function getKioskContext(): Promise<ApiResponse<KioskContext>> {
    const { data } = await api.get<ApiResponse<KioskContext>>("/attendance/kiosk-context", {
        headers: deviceHeaders()
    });
    return data;
}

export async function clockAttendance(payload: {
    userId: string;
    pin: string;
    reason?: string;
}): Promise<ApiResponse<ClockResult>> {
    const { data } = await api.post<ApiResponse<ClockResult>>("/attendance/clock", payload, {
        headers: deviceHeaders()
    });
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

export async function getAttendanceEnrollStores(credentials: {
    username: string;
    password: string;
}): Promise<ApiResponse<AttendanceEnrollStore[]>> {
    const { data } = await api.post<ApiResponse<AttendanceEnrollStore[]>>(
        "/attendance/devices/enroll-options",
        credentials
    );
    return data;
}

export async function enrollAttendanceDevice(
    payload: EnrollAttendanceDevicePayload
): Promise<ApiResponse<{ token: string; device: Pick<AttendanceDevice, "id" | "name" | "createdAt" | "store"> }>> {
    const { data } = await api.post<ApiResponse<{ token: string; device: Pick<AttendanceDevice, "id" | "name" | "createdAt" | "store"> }>>(
        "/attendance/devices/enroll",
        payload
    );
    return data;
}

export async function getAttendanceDevices(
    storeId?: string
): Promise<ApiResponse<AttendanceDevice[]>> {
    const { data } = await api.get<ApiResponse<AttendanceDevice[]>>("/attendance/devices", {
        params: { storeId }
    });
    return data;
}

export async function revokeAttendanceDevice(id: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(`/attendance/devices/${id}`);
    return data;
}
