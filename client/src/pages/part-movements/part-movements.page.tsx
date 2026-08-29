import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    PartMovementToolbar,
    PartMovementsTable,
    PartMovementsEmptyState,
    PartMovementModal,
    PartMovementViewModal
} from "@/components";
import { PaginationControls } from "@/components/ui";
import { usePartMovements, usePagination } from "@/hooks";
import type { PartMovement } from "@/types";
import { LoadingState } from "@/components/ui/spinner";

export function PartMovementsPage() {

    const { data, isLoading, isError } = usePartMovements();
    const movements = data?.data ?? [];
    const { pageItems: pagedMovements, page, setPage, totalPages, totalItems, pageSize } = usePagination(movements);
    const [open, setOpen] = useState(false);
    const [movementToView, setMovementToView] = useState<PartMovement | null>(null);

    return (
        <PageContainer>

            <PageHeader
                title="Movimientos de piezas"
                description="Registra la carga (producción) y descarga (consumo) de piezas de metal."
            />

            <div className="mt-8">
                <PartMovementToolbar onNewMovement={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar los movimientos.</p>}
                {!isLoading && !isError && (
                    movements.length === 0
                        ? <PartMovementsEmptyState />
                        : (
                            <>
                                <PartMovementsTable
                                    movements={pagedMovements}
                                    onView={(movement) => setMovementToView(movement)}
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

            <PartMovementModal open={open} onOpenChange={setOpen} />

            <PartMovementViewModal
                open={!!movementToView}
                movement={movementToView}
                onOpenChange={(value) => {
                    if (!value) {
                        setMovementToView(null);
                    }
                }}
            />

        </PageContainer>
    );
}
