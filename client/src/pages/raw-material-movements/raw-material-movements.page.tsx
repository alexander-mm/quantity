import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    RawMaterialMovementToolbar,
    RawMaterialMovementsTable,
    RawMaterialMovementsEmptyState,
    RawMaterialMovementModal,
    RawMaterialMovementViewModal
} from "@/components";
import { PaginationControls } from "@/components/ui";
import { useRawMaterialMovements, usePagination } from "@/hooks";
import type { RawMaterialMovement } from "@/types";
import { LoadingState } from "@/components/ui/spinner";

export function RawMaterialMovementsPage() {

    const { data, isLoading, isError } = useRawMaterialMovements();
    const movements = data?.data ?? [];
    const { pageItems: pagedMovements, page, setPage, totalPages, totalItems, pageSize } = usePagination(movements);
    const [open, setOpen] = useState(false);
    const [movementToView, setMovementToView] = useState<RawMaterialMovement | null>(null);

    return (
        <PageContainer>

            <PageHeader
                title="Movimientos de materia prima"
                description="Registra la entrada (compra) y salida (consumo) de láminas, tubos y varillas."
            />

            <div className="mt-8">
                <RawMaterialMovementToolbar onNewMovement={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar los movimientos.</p>}
                {!isLoading && !isError && (
                    movements.length === 0
                        ? <RawMaterialMovementsEmptyState />
                        : (
                            <>
                                <RawMaterialMovementsTable
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

            <RawMaterialMovementModal open={open} onOpenChange={setOpen} />

            <RawMaterialMovementViewModal
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
