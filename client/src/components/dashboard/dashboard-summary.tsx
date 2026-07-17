import {
    ArrowRightLeft,
    Boxes,
    Package,
    Store,
    UserCog,
    Users
} from "lucide-react";

import { StatCard } from "@/components";

type DashboardSummaryProps = {

    summary: {

        totalProducts: number;

        totalClients: number;

        totalStores: number;

        totalUsers: number;

        totalStock: number;

        lowStockProducts: number;

        outOfStockProducts: number;

        todayMovements: number;

    };

};

export function DashboardSummary({

    summary

}: DashboardSummaryProps) {

    return (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            <StatCard
                title="Productos"
                description="Total registrados"
                value={summary.totalProducts}
                icon={Package}
            />

            <StatCard
                title="Clientes"
                description="Clientes activos"
                value={summary.totalClients}
                icon={Users}
            />

            <StatCard
                title="Tiendas"
                description="Sucursales"
                value={summary.totalStores}
                icon={Store}
            />

            <StatCard
                title="Usuarios"
                description="Usuarios activos"
                value={summary.totalUsers}
                icon={UserCog}
            />

            <StatCard
                title="Stock"
                description="Inventario total"
                value={summary.totalStock}
                icon={Boxes}
            />

            <StatCard
                title="Movimientos"
                description="Registrados hoy"
                value={summary.todayMovements}
                icon={ArrowRightLeft}
            />

        </div>

    );

}