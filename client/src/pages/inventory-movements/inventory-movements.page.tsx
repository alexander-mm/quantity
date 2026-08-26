import {
    PageContainer,
    PageHeader,
    InventoryMovementsTable,
    InventoryMovementsEmptyState,
    InventoryMovementModal,
    InventoryMovementViewModal,
    InventoryMovementsToolbar,
    ConfirmInventoryMovementDialog,
    CancelInventoryMovementDialog
} from "@/components";
import { useInventoryMovements, useConfirmInventoryMovement, useCancelInventoryMovement, useStores, usePagination } from "@/hooks";
import { PaginationControls } from "@/components/ui";
import { toast } from "react-hot-toast";
import { useState, useMemo } from "react";
import type { InventoryMovement } from "@/types";

export function InventoryMovementsPage() {

    const {
        data,
        isLoading,
        isError
    } = useInventoryMovements();

    const { data: storesData } = useStores();
    const stores = storesData?.data ?? [];

    const confirmMutation = useConfirmInventoryMovement();
    const cancelMutation = useCancelInventoryMovement();

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [storeId, setStoreId] = useState("");
    const [movementToView, setMovementToView] = useState<InventoryMovement | null>(null);
    const [movementToEdit, setMovementToEdit] = useState<InventoryMovement | null>(null);
    const [movementToConfirm, setMovementToConfirm] = useState<InventoryMovement | null>(null);
    const [movementToCancel, setMovementToCancel] = useState<InventoryMovement | null>(null);

    const movements = useMemo(() => {

        const list = data?.data ?? [];
        const term = search.toLowerCase();

        return list.filter(m => {

            const matchesSearch =
                !term ||
                m.product.name.toLowerCase().includes(term) ||
                m.movementType.name.toLowerCase().includes(term) ||
                m.store.name.toLowerCase().includes(term);

            const matchesStore = !storeId || m.store.id === storeId;

            return matchesSearch && matchesStore;

        });

    }, [data, search, storeId]);

    const { pageItems: pagedMovements, page, setPage, totalPages, totalItems, pageSize } = usePagination(movements);

    if (isLoading) {

        return (
            <PageContainer>
                <PageHeader
                    title="Movimientos"
                    description="Administra los movimientos del inventario."
                />

                Cargando...

            </PageContainer>
        );

    }

    if (isError) {

        return (
            <PageContainer>
                <PageHeader
                    title="Movimientos"
                    description="Administra los movimientos del inventario."
                />
                <p className="mt-6">
                    Error al cargar los movimientos.
                </p>
            </PageContainer>
        );

    }

    return (

        <PageContainer>

            <PageHeader
                title="Movimientos"
                description="Administra los movimientos del inventario."
            />

            <div className="mt-8">
                <InventoryMovementsToolbar
                    onNewMovement={() => setOpen(true)}
                    search={search}
                    onSearchChange={setSearch}
                    stores={stores}
                    storeId={storeId}
                    onStoreChange={setStoreId}
                />
            </div>

            <div className="mt-6">
                {
                    movements.length === 0
                        ? (
                            <InventoryMovementsEmptyState />
                        )
                        : (
                            <>
                                <InventoryMovementsTable
                                    movements={pagedMovements}
                                    onView={(movement) => setMovementToView(movement)}
                                    onEdit={(movement) => setMovementToEdit(movement)}
                                    onConfirm={(movement) => setMovementToConfirm(movement)}
                                    onCancel={(movement) => setMovementToCancel(movement)}
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
                }
            </div>

            <InventoryMovementModal
                open={open}
                onOpenChange={setOpen}
            />

            <InventoryMovementModal
                open={!!movementToEdit}
                movement={movementToEdit}
                onOpenChange={() => setMovementToEdit(null)}
            />

            <InventoryMovementViewModal
                open={!!movementToView}
                movement={movementToView}
                onOpenChange={(value) => {
                    if (!value) {
                        setMovementToView(null);
                    }
                }}
            />

            <ConfirmInventoryMovementDialog
                open={!!movementToConfirm}
                loading={confirmMutation.isPending}
                onOpenChange={() => setMovementToConfirm(null)}
                onConfirm={() => {
                    if (!movementToConfirm) {
                        return;
                    }
                    confirmMutation.mutate(movementToConfirm.id, {
                        onSuccess: () => {
                            toast.success("Movimiento confirmado.");
                            setMovementToConfirm(null);
                        },
                        onError: () => {
                            toast.error("No se pudo confirmar.");
                        }
                    });
                }}
            />

            <CancelInventoryMovementDialog
                open={!!movementToCancel}
                loading={cancelMutation.isPending}
                onOpenChange={() => setMovementToCancel(null)}
                onConfirm={() => {
                    if (!movementToCancel) {
                        return;
                    }
                    cancelMutation.mutate(movementToCancel.id, {
                        onSuccess: () => {
                            toast.success("Movimiento cancelado.");
                            setMovementToCancel(null);
                        },
                        onError: () => {
                            toast.error("No se pudo cancelar el movimiento.");
                        }
                    });
                }}
            />

        </PageContainer>

    );

}
