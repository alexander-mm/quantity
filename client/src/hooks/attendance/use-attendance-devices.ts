import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    enrollAttendanceDevice,
    getAttendanceDevices,
    getAttendanceEnrollStores,
    revokeAttendanceDevice
} from "@/services";
import { setAttendanceDeviceToken } from "@/lib/attendance-device-token";

export function useAttendanceDevices(storeId?: string) {
    return useQuery({
        queryKey: ["attendance", "devices", storeId ?? "all"],
        queryFn: () => getAttendanceDevices(storeId)
    });
}

export function useRevokeAttendanceDevice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: revokeAttendanceDevice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance", "devices"] });
        }
    });
}

export function useAttendanceEnrollStores() {
    return useMutation({
        mutationFn: getAttendanceEnrollStores
    });
}

export function useEnrollAttendanceDevice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enrollAttendanceDevice,
        onSuccess: (response) => {
            setAttendanceDeviceToken(response.data.token);
            queryClient.invalidateQueries({ queryKey: ["attendance", "kiosk-context"] });
        }
    });
}
