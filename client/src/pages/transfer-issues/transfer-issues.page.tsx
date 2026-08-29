import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    StockTransfersTable,
    ResolveTransferModal,
    TransferIssueViewModal
} from "@/components";
import { useStockTransfers, useAuth } from "@/hooks";
import { ROLES } from "@/constants/roles";
import type { StockTransfer } from "@/types";
import { LoadingState } from "@/components/ui/spinner";

export function TransferIssuesPage() {

    const { data, isLoading, isError } = useStockTransfers();
    const { user } = useAuth();
    const isAdmin = user?.roleName === ROLES.ADMIN;
    const [transferToView, setTransferToView] = useState<StockTransfer | null>(null);

    const allIssues = (data?.data ?? []).filter(t => t.status === "WITH_ISSUES");

    const issues = isAdmin
        ? allIssues
        : allIssues.filter(t =>
            (t.destType === "STORE" && t.destStore?.id === user?.storeId) ||
            (t.destType === "TECHNICIAN" && t.destUser?.id === user?.id)
        );

    return (
        <PageContainer>
            <PageHeader
                title="Novedades de Transferencias"
                description={
                    isAdmin
                        ? "Envíos con diferencias reportadas, pendientes de resolución."
                        : "Novedades reportadas en tus envíos recibidos, y su estado de resolución."
                }
            />

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar las novedades.</p>}
                {!isLoading && !isError && (
                    issues.length === 0
                        ? <p className="text-muted-foreground">No hay novedades pendientes.</p>
                        : <StockTransfersTable transfers={issues} onView={setTransferToView} />
                )}
            </div>

            {isAdmin ? (
                <ResolveTransferModal
                    open={!!transferToView}
                    transfer={transferToView}
                    onOpenChange={() => setTransferToView(null)}
                />
            ) : (
                <TransferIssueViewModal
                    open={!!transferToView}
                    transfer={transferToView}
                    onOpenChange={() => setTransferToView(null)}
                />
            )}

        </PageContainer>
    );
}
