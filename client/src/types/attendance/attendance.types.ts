export interface KioskEmployee {
    id: string;
    firstName: string;
    lastName: string;
    clockedIn: boolean;
}

export interface KioskContext {
    store: {
        id: string;
        name: string;
    };
    employees: KioskEmployee[];
}

export type AttendanceAction = "clock-in" | "clock-out";

export interface AttendanceRecordUser {
    id: string;
    firstName: string;
    lastName: string;
}

export interface AttendanceRecordStore {
    id: string;
    name: string;
}

export interface AttendanceRecord {
    id: string;
    uuid: string;
    userId: string;
    storeId: string;
    clockIn: string;
    clockInReason: string | null;
    clockOut: string | null;
    clockOutReason: string | null;
    createdAt: string;
    user: AttendanceRecordUser;
    store: AttendanceRecordStore;
}

export interface ClockResult {
    action: AttendanceAction;
    record: AttendanceRecord;
}

export interface AttendanceFilters {
    storeId?: string;
    userId?: string;
    from?: string;
    to?: string;
}

export interface AttendanceEnrollStore {
    id: string;
    name: string;
}

export interface AttendanceDevice {
    id: string;
    name: string;
    lastUsedAt: string | null;
    lastIp: string | null;
    createdAt: string;
    store: AttendanceRecordStore;
}

export interface EnrollAttendanceDevicePayload {
    username: string;
    password: string;
    storeId: string;
    name: string;
}
