export interface DashboardSummaryDto {

    totalProducts: number;

    totalClients: number;

    totalStores: number;

    totalUsers: number;

    totalStock: number;

    lowStockProducts: number;

    outOfStockProducts: number;

    todayMovements: number;

}

export interface DashboardDataDto {

    summary: DashboardSummaryDto;

    latestMovements: unknown[];

}