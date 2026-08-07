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
import { useRawMaterialMovements } from "@/hooks";
import type { RawMaterialMovement } from "@/types";

export function RawMaterialMovementsPage() {

    const { data, isLoading, isError } = useRawMaterialMovements();
    const movements = data?.data ?? [];
    const [open, setOpen] = useState(false);
    const [movementToView, setMovementToView] = useState<RawMaterialMovement | null>(null);

    return (
        <PageContainer>

            <PageHeader
                title="Movimientos de materia prima"
                description="Registra la entrada (compra) y salida (consumo) de láminas y tubos."
            />

            <div className="mt-8">
                <RawMaterialMovementToolbar onNewMovement={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los movimientos.</p>}
                {!isLoading && !isError && (
                    movements.length === 0
                        ? <RawMaterialMovementsEmptyState />
                        : (
                            <RawMaterialMovementsTable
                                movements={movements}
                                onView={(movement) => setMovementToView(movement)}
                            />
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
