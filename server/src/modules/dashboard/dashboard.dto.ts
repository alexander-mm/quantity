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

export interface DashboardSalesTrendPointDto {

    date: string;

    count: number;

}

export interface DashboardStockByStoreDto {

    storeId: string;

    storeName: string;

    quantity: number;

}

export interface DashboardDataDto {

    summary: DashboardSummaryDto;

    latestMovements: unknown[];

    salesTrend: DashboardSalesTrendPointDto[];

    stockByStore: DashboardStockByStoreDto[];

}