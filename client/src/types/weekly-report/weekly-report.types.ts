export interface WeeklyReport {
    id: string;
    uuid: string;
    weekStart: string;
    weekEnd: string;
    telegramSent: boolean;
    telegramError: string | null;
    createdAt: string;
}
