export interface ClockAttendanceDto {
    userId: string;
    pin: string;
}

export interface SetAttendancePinDto {
    pin: string;
}

export interface AttendanceFiltersDto {
    storeId?: string;
    userId?: string;
    from?: string;
    to?: string;
}
