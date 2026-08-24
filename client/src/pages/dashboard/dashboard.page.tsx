import { useDashboard } from "@/hooks";
import {
    DashboardRecentMovements,
    DashboardSalesTrendChart,
    DashboardStockByStoreChart,
    DashboardSummary,
    PageContainer,
    PageHeader
} from "@/components";

export function DashboardPage() {

    const { data, isLoading, error } = useDashboard();
    const summary = data?.data.summary;
    const latestMovements = data?.data.latestMovements ?? [];
    const salesTrend = data?.data.salesTrend ?? [];
    const stockByStore = data?.data.stockByStore ?? [];

    if (isLoading) {

        return <h2>Cargando dashboard...</h2>;

    }

    if (error) {

        return <h2>Error al cargar el dashboard.</h2>;

    }

    return (

    <PageContainer>

        <PageHeader

            title="Dashboard"

            description="Resumen general del sistema."

        />

        {summary && (

            <DashboardSummary

                summary={summary}

            />
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <DashboardSalesTrendChart data={salesTrend} />
            <DashboardStockByStoreChart data={stockByStore} />
        </div>

        <div className="mt-6">
            <DashboardRecentMovements

    movements={latestMovements}

/>
        </div>

    </PageContainer>

);
}