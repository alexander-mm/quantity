import { useState } from "react";
import { PageContainer, PageHeader, StockTransfersTable, ResolveTransferModal } from "@/components";
import { useStockTransfers } from "@/hooks";
import type { StockTransfer } from "@/types";

export function TransferIssuesPage() {

    const { data, isLoading, isError } = useStockTransfers();
    const [transferToResolve, setTransferToResolve] = useState<StockTransfer | null>(null);

    const issues = (data?.data ?? []).filter(t => t.status === "WITH_ISSUES");

    return (
        <PageContainer>
            <PageHeader
                title="Novedades"
                description="Envíos con diferencias reportadas, pendientes de resolución."
            />

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar las novedades.</p>}
                {!isLoading && !isError && (
                    issues.length === 0
                        ? <p className="text-muted-foreground">No hay novedades pendientes.</p>
                        : <StockTransfersTable transfers={issues} onView={setTransferToResolve} />
                )}
            </div>

            <ResolveTransferModal
                open={!!transferToResolve}
                transfer={transferToResolve}
                onOpenChange={() => setTransferToResolve(null)}
            />

        </PageContainer>
    );
}
