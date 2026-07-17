import { useDashboard } from "@/hooks";
import { DashboardRecentMovements, DashboardSummary, PageContainer, PageHeader } from "@/components";

export function DashboardPage() {

    const { data, isLoading, error } = useDashboard();
    const summary = data?.data.summary;
    const latestMovements = data?.data.latestMovements ?? [];

    if (isLoading) {

        return <h2>Cargando dashboard...</h2>;

    }

    if (error) {

        return <h2>Error al cargar el dashboard.</h2>;

    }

    console.log(latestMovements);

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
        <DashboardRecentMovements

    movements={latestMovements}

/>

    </PageContainer>

);
}