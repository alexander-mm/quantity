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
import { usePartMovements } from "@/hooks";
import type { PartMovement } from "@/types";

export function PartMovementsPage() {

    const { data, isLoading, isError } = usePartMovements();
    const movements = data?.data ?? [];
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
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los movimientos.</p>}
                {!isLoading && !isError && (
                    movements.length === 0
                        ? <PartMovementsEmptyState />
                        : (
                            <PartMovementsTable
                                movements={movements}
                                onView={(movement) => setMovementToView(movement)}
                            />
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
