import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
    PageContainer,
    PageHeader,
    CuttingOrdersToolbar,
    CuttingOrdersTable,
    CuttingOrdersEmptyState,
    CuttingOrderModal,
    CuttingOrderViewModal,
    ConfirmCuttingOrderDialog,
    DeleteCuttingOrderDialog
} from "@/components";
import {
    usePartCuttingOrders,
    useConfirmPartCuttingOrder,
    useDeletePartCuttingOrder
} from "@/hooks";
import type { PartCuttingOrder } from "@/types";

function getErrorMessage(error: unknown, fallback: string) {
    return axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
        ? error.response.data.message
        : fallback;
}

export function PartCuttingOrdersPage() {

    const { data, isLoading, isError } = usePartCuttingOrders();
    const orders = data?.data ?? [];

    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PartCuttingOrder | null>(null);
    const [orderToView, setOrderToView] = useState<PartCuttingOrder | null>(null);
    const [orderToConfirm, setOrderToConfirm] = useState<PartCuttingOrder | null>(null);
    const [orderToDelete, setOrderToDelete] = useState<PartCuttingOrder | null>(null);

    const confirmMutation = useConfirmPartCuttingOrder();
    const deleteMutation = useDeletePartCuttingOrder();

    return (
        <PageContainer>

            <PageHeader
                title="Órdenes de corte"
                description="Registra el consumo de láminas o tubos y la producción de piezas resultante."
            />

            <div className="mt-8">
                <CuttingOrdersToolbar onNewOrder={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar las órdenes de corte.</p>}
                {!isLoading && !isError && (
                    orders.length === 0
                        ? <CuttingOrdersEmptyState />
                        : (
                            <CuttingOrdersTable
                                orders={orders}
                                onView={(order) => setOrderToView(order)}
                                onEdit={(order) => {
                                    setSelectedOrder(order);
                                    setOpen(true);
                                }}
                                onConfirm={(order) => setOrderToConfirm(order)}
                                onDelete={(order) => setOrderToDelete(order)}
                            />
                        )
                )}
            </div>

            <CuttingOrderModal
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setSelectedOrder(null);
                    }
                }}
                mode={selectedOrder ? "edit" : "create"}
                orderId={selectedOrder?.id}
            />

            <CuttingOrderViewModal
                open={!!orderToView}
                order={orderToView}
                onOpenChange={(value) => {
                    if (!value) {
                        setOrderToView(null);
                    }
                }}
            />

            <ConfirmCuttingOrderDialog
                open={!!orderToConfirm}
                order={orderToConfirm}
                loading={confirmMutation.isPending}
                onOpenChange={(value) => {
                    if (!value) {
                        setOrderToConfirm(null);
                    }
                }}
                onConfirm={(data) => {
                    if (!orderToConfirm) {
                        return;
                    }
                    confirmMutation.mutate({ id: orderToConfirm.id, data }, {
                        onSuccess: () => {
                            toast.success("Orden de corte confirmada: inventario actualizado.");
                            setOrderToConfirm(null);
                        },
                        onError: (error) => {
                            toast.error(getErrorMessage(error, "No se pudo confirmar la orden de corte."));
                        }
                    });
                }}
            />

            <DeleteCuttingOrderDialog
                open={!!orderToDelete}
                loading={deleteMutation.isPending}
                onOpenChange={(value) => {
                    if (!value) {
                        setOrderToDelete(null);
                    }
                }}
                onConfirm={() => {
                    if (!orderToDelete) {
                        return;
                    }
                    deleteMutation.mutate(orderToDelete.id, {
                        onSuccess: () => {
                            toast.success("Orden de corte eliminada.");
                            setOrderToDelete(null);
                        },
                        onError: (error) => {
                            toast.error(getErrorMessage(error, "No se pudo eliminar la orden de corte."));
                        }
                    });
                }}
            />

        </PageContainer>
    );
}
