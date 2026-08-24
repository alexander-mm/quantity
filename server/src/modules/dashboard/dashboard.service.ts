import { prisma } from "../../database/prisma/prisma.js";
import {
    DashboardDataDto,
    DashboardSalesTrendPointDto,
    DashboardStockByStoreDto,
    DashboardSummaryDto
} from "./dashboard.dto.js";

function toLocalDateKey(date: Date): string {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

export class DashboardService {

    async getDashboard(): Promise<DashboardDataDto> {

        const trendStart = new Date();
        trendStart.setHours(0, 0, 0, 0);
        trendStart.setDate(trendStart.getDate() - 6);

        const [
            totalProducts,
            totalClients,
            totalStores,
            totalUsers,
            totalStock,
            outOfStockProducts,
            todayMovements,
            stockLevels,
            latestMovements,
            recentSales,
            stockByStoreGroups,
            stores

        ] = await Promise.all([
            prisma.product.count({
                where: {
                    isActive: true
                }
            }),
            prisma.client.count({
                where: {
                    isActive: true
                }
            }),
            prisma.store.count({
                where: {
                    isActive: true
                }
            }),
            prisma.user.count({
                where: {
                    isActive: true
                }
            }),
            prisma.inventoryStock.aggregate({
                _sum: {
                    quantity: true
                }
            }),

            prisma.inventoryStock.count({
                where: {
                    quantity: {
                        lte: 0
                    }
                }
            }),

            prisma.inventoryMovement.count({
                where: {
                    isActive: true,
                    movementDate: {
                        gte: new Date(
                            new Date().setHours(0, 0, 0, 0)
                        )
                    }
                }
            }),
            prisma.inventoryStock.findMany({
                select: {
                    quantity: true,
                    product: {
                        select: {
                            minimumStock: true
                        }
                    }
                }
            }),

            prisma.inventoryMovement.findMany({
                where: {
                    isActive: true
                },
                select: {
                    quantity: true,
                    movementDate: true,
                    movementType: {
                        select: {
                            name: true
                        }
                    },
                    product: {
                        select: {
                            name: true
                        }
                    },
                    user: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                },

                orderBy: {
                    movementDate: "desc"
                },
                take: 10
            }),

            prisma.sale.findMany({
                where: {
                    status: "CONFIRMED",
                    saleDate: {
                        gte: trendStart
                    }
                },
                select: {
                    saleDate: true
                }
            }),

            prisma.inventoryStock.groupBy({
                by: ["storeId"],
                _sum: {
                    quantity: true
                }
            }),

            prisma.store.findMany({
                where: {
                    isActive: true
                },
                select: {
                    id: true,
                    name: true
                }
            })
        ]);

        const salesByDay = new Map<string, number>();

        for (const sale of recentSales) {
            const key = toLocalDateKey(sale.saleDate);
            salesByDay.set(key, (salesByDay.get(key) ?? 0) + 1);
        }

        const salesTrend: DashboardSalesTrendPointDto[] = [];

        for (let i = 0; i < 7; i++) {

            const day = new Date(trendStart);
            day.setDate(day.getDate() + i);

            const key = toLocalDateKey(day);

            salesTrend.push({
                date: key,
                count: salesByDay.get(key) ?? 0
            });

        }

        const storeNameById = new Map(
            stores.map(store => [store.id.toString(), store.name])
        );

        const stockByStore: DashboardStockByStoreDto[] = stockByStoreGroups
            .map(group => ({
                storeId: group.storeId.toString(),
                storeName: storeNameById.get(group.storeId.toString()) ?? "Tienda",
                quantity: Number(group._sum.quantity ?? 0)
            }))
            .filter(item => storeNameById.has(item.storeId))
            .sort((a, b) => b.quantity - a.quantity);

        const lowStockProducts = stockLevels.filter(
            stock =>
                Number(stock.quantity) <=
                Number(stock.product.minimumStock)
        ).length;
        const summary: DashboardSummaryDto = {
            totalProducts,
            totalClients,
            totalStores,
            totalUsers,
            totalStock: Number(
                totalStock._sum?.quantity ?? 0
            ),
            lowStockProducts,
            outOfStockProducts,
            todayMovements
        };
        return {
            summary,
            latestMovements,
            salesTrend,
            stockByStore
        };
    }
}