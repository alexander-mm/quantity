import { prisma } from "../../database/prisma/prisma.js";
import {
    DashboardDataDto,
    DashboardSummaryDto
} from "./dashboard.dto.js";

export class DashboardService {

    async getDashboard(): Promise<DashboardDataDto> {

 const [

    totalProducts,

    totalClients,

    totalStores,

    totalUsers,

    totalStock,

    outOfStockProducts,

    todayMovements,

    stockLevels,

    latestMovements

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

    where: {

        isActive: true

    },

    _sum: {

        quantity: true

    }

}),

prisma.inventoryStock.count({

    where: {

        isActive: true,

        quantity: 0

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

    where: {

        isActive: true

    },

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

                include: {

                    product: {

    select: {

        id: true,

        internalCode: true,

        barcode: true,

        name: true,

        salePrice: true,

        minimumStock: true

    }

},

                    movementType: {

    select: {

        id: true,

        code: true,

        name: true,

        stockOperation: true

    }

},

                user: {

                    select: {

                        id: true,

                        username: true,

                        firstName: true,

                        lastName: true

                    }

                },

                    store: {

    select: {

        id: true,

        code: true,

        name: true

    }

},

                    client: {

    select: {

        id: true,

        document: true,

        firstName: true,

        lastName: true,

        companyName: true

    }

}

                },

                orderBy: {

                    movementDate: "desc"

                },

                take: 10

            })

        ]);

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

                totalStock._sum.quantity ?? 0

            ),

            lowStockProducts,

            outOfStockProducts,

            todayMovements

        };

        return {

            summary,

            latestMovements

        };

    }

}