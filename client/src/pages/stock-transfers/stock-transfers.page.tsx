import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    StockTransfersToolbar,
    StockTransfersTable,
    StockTransferModal,
    ReceiveTransferModal
} from "@/components";
import { useStockTransfers } from "@/hooks";
import type { StockTransfer } from "@/types";

export function StockTransfersPage() {

    const { data, isLoading, isError } = useStockTransfers();
    const transfers = data?.data ?? [];
    const [open, setOpen] = useState(false);
    const [transferToEdit, setTransferToEdit] = useState<StockTransfer | null>(null);
    const [transferToView, setTransferToView] = useState<StockTransfer | null>(null);

    return (
        <PageContainer>
            <PageHeader title="Envíos a tiendas" description="Despacha pedidos desde la bodega principal." />

            <div className="mt-8">
                <StockTransfersToolbar onNewTransfer={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los envíos.</p>}
                {!isLoading && !isError && (
                    transfers.length === 0
                        ? <p className="text-muted-foreground">No existen envíos registrados.</p>
                        : (
                            <StockTransfersTable
                                transfers={transfers}
                                onView={setTransferToView}
                                onEdit={setTransferToEdit}
                            />
                        )
                )}
            </div>

            <StockTransferModal
                open={open}
                onOpenChange={setOpen}
            />

            <StockTransferModal
                open={!!transferToEdit}
                transfer={transferToEdit}
                onOpenChange={() => setTransferToEdit(null)}
            />

            <ReceiveTransferModal
                open={!!transferToView}
                transfer={transferToView}
                onOpenChange={() => setTransferToView(null)}
            />

        </PageContainer>
    );
}
