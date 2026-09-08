import { useState } from "react";
import { LoadingState } from "@/components/ui/spinner";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
    PageContainer,
    PageHeader,
    StockTransfersToolbar,
    StockTransfersTable,
    StockTransferModal,
    ReceiveTransferModal,
    DispatchTransferDialog,
    DeleteTransferDialog
} from "@/components";
import { useStockTransfers, useDispatchStockTransfer, useDeleteStockTransfer } from "@/hooks";
import type { StockTransfer } from "@/types";

export function StockTransfersPage() {

    const { data, isLoading, isError } = useStockTransfers();
    const transfers = data?.data ?? [];
    const [open, setOpen] = useState(false);
    const [transferToEdit, setTransferToEdit] = useState<StockTransfer | null>(null);
    const [transferToView, setTransferToView] = useState<StockTransfer | null>(null);
    const [transferToDispatch, setTransferToDispatch] = useState<StockTransfer | null>(null);
    const [transferToDelete, setTransferToDelete] = useState<StockTransfer | null>(null);

    const dispatchMutation = useDispatchStockTransfer();
    const deleteMutation = useDeleteStockTransfer();

    return (
        <PageContainer>
            <PageHeader title="Envíos a tiendas" description="Despacha pedidos desde la bodega principal." />

            <div className="mt-8">
                <StockTransfersToolbar onNewTransfer={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar los envíos.</p>}
                {!isLoading && !isError && (
                    transfers.length === 0
                        ? <p className="text-muted-foreground">No existen envíos registrados.</p>
                        : (
                            <StockTransfersTable
                                transfers={transfers}
                                onView={setTransferToView}
                                onEdit={setTransferToEdit}
                                onDispatch={setTransferToDispatch}
                                onDelete={setTransferToDelete}
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

            <DispatchTransferDialog
                open={!!transferToDispatch}
                loading={dispatchMutation.isPending}
                onOpenChange={() => setTransferToDispatch(null)}
                onConfirm={() => {

                    if (!transferToDispatch) return;

                    dispatchMutation.mutate(transferToDispatch.id, {
                        onSuccess: () => {
                            toast.success("Envío despachado correctamente.");
                            setTransferToDispatch(null);
                        },
                        onError: (error) => {
                            const message =
                                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                                    ? error.response.data.message
                                    : "No se pudo despachar el envío.";
                            toast.error(message);
                        }
                    });

                }}
            />

            <DeleteTransferDialog
                open={!!transferToDelete}
                loading={deleteMutation.isPending}
                onOpenChange={() => setTransferToDelete(null)}
                onConfirm={() => {

                    if (!transferToDelete) return;

                    deleteMutation.mutate(transferToDelete.id, {
                        onSuccess: () => {
                            toast.success("Envío eliminado correctamente.");
                            setTransferToDelete(null);
                        },
                        onError: (error) => {
                            const message =
                                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                                    ? error.response.data.message
                                    : "No se pudo eliminar el envío.";
                            toast.error(message);
                        }
                    });

                }}
            />

        </PageContainer>
    );
}
