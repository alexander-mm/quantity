import { useState } from "react";
import { PageContainer, PageHeader, StockTransfersTable, ReceiveTransferModal } from "@/components";
import { useStockTransfers, useAuth } from "@/hooks";
import type { StockTransfer } from "@/types";
import { LoadingState } from "@/components/ui/spinner";

export function PendingReceptionsPage() {

    const { data, isLoading, isError } = useStockTransfers();
    const { user } = useAuth();
    const [transferToReceive, setTransferToReceive] = useState<StockTransfer | null>(null);

const pending = (data?.data ?? []).filter(t =>
    t.status === "PENDING" &&
    (
        (t.destType === "STORE" && t.destStore?.id === user?.storeId) ||
        (t.destType === "TECHNICIAN" && t.destUser?.id === user?.id)
    )
);

    return (
        <PageContainer>
            <PageHeader title="Recepciones pendientes" description="Confirma o reporta novedades de los envíos que llegaron a tu tienda." />

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar las recepciones.</p>}
                {!isLoading && !isError && (
                    pending.length === 0
                        ? <p className="text-muted-foreground">No tienes recepciones pendientes.</p>
                        : <StockTransfersTable transfers={pending} onView={setTransferToReceive} />
                )}
            </div>

            <ReceiveTransferModal
                open={!!transferToReceive}
                transfer={transferToReceive}
                onOpenChange={() => setTransferToReceive(null)}
            />

        </PageContainer>
    );
}
