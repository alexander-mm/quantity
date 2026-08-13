import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader } from "@/components";
import { WholesalersTable, WholesalersEmptyState } from "@/components";
import { useClients, useWholesalerCreditSummary } from "@/hooks";
import type { Client } from "@/types";

export function WholesalersPage() {

    const { data, isLoading, isError } = useClients();
    const { data: summaryData } = useWholesalerCreditSummary();
    const navigate = useNavigate();

    const wholesalers = useMemo(
        () => (data?.data ?? []).filter((client: Client) => client.isWholesaler),
        [data]
    );

    const summary = summaryData?.data ?? [];

    return (
        <PageContainer>

            <PageHeader
                title="Admin. de Mayoristas"
                description="Clientes mayoristas y el crédito pendiente de cada uno."
            />

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los mayoristas.</p>}
                {!isLoading && !isError && (
                    wholesalers.length === 0
                        ? <WholesalersEmptyState />
                        : (
                            <WholesalersTable
                                wholesalers={wholesalers}
                                summary={summary}
                                onView={(client) => navigate(`/wholesalers/${client.id}`)}
                            />
                        )
                )}
            </div>

        </PageContainer>
    );
}
