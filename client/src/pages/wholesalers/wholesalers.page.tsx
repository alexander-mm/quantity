import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader } from "@/components";
import { WholesalersTable, WholesalersEmptyState } from "@/components";
import { PaginationControls } from "@/components/ui";
import { useClients, useAccountsReceivable, useAccountReceivableSummary, usePagination } from "@/hooks";
import type { Client } from "@/types";

export function WholesalersPage() {

    const { data, isLoading, isError } = useClients();
    const { data: accountsReceivableData } = useAccountsReceivable();
    const { data: summaryData } = useAccountReceivableSummary();
    const navigate = useNavigate();

    const clientsWithAccounts = useMemo(() => {

        const clients = data?.data ?? [];
        const accounts = accountsReceivableData?.data ?? [];

        const clientIds = new Set(accounts.map(item => item.clientId));

        return clients.filter((client: Client) => clientIds.has(client.id));

    }, [data, accountsReceivableData]);

    const summary = summaryData?.data ?? [];

    const { pageItems: pagedWholesalers, page, setPage, totalPages, totalItems, pageSize } = usePagination(clientsWithAccounts);

    return (
        <PageContainer>

            <PageHeader
                title="Cuentas de Cobro"
                description="Clientes con cuentas de cobro registradas y el saldo pendiente de cada uno."
            />

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los clientes.</p>}
                {!isLoading && !isError && (
                    clientsWithAccounts.length === 0
                        ? <WholesalersEmptyState />
                        : (
                            <>
                                <WholesalersTable
                                    wholesalers={pagedWholesalers}
                                    summary={summary}
                                    onView={(client) => navigate(`/wholesalers/${client.id}`)}
                                />
                                <PaginationControls
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    totalItems={totalItems}
                                    pageSize={pageSize}
                                />
                            </>
                        )
                )}
            </div>

        </PageContainer>
    );
}
