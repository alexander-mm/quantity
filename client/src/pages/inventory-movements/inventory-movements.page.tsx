import {
    PageContainer,
    PageHeader,
    InventoryMovementsToolbar,
    InventoryMovementsTable,
    InventoryMovementsEmptyState,
    InventoryMovementModal
} from "@/components";
import { useInventoryMovements } from "@/hooks";
import { useState } from "react";

export function InventoryMovementsPage() {

    const {
        data,
        isLoading,
        isError
    } = useInventoryMovements();

    const movements = data?.data ?? [];
    const [open, setOpen] = useState(false);

    if (isLoading) {

        return (
            <PageContainer>

                <PageHeader
                    title="Movimientos"
                    description="Administra los movimientos del inventario."
                />

                <p className="mt-6">
                    Cargando...
                </p>

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
                    onNewMovement={() => {
                        setOpen(true);
                    }}
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

                                    movements={movements}

                                    onView={() => {

                                    }}

                                />

                                <p className="mt-4 text-sm text-muted-foreground">

                                    Mostrando {movements.length} movimientos

                                </p>

                            </>
                        )
                }

            </div>
            <InventoryMovementModal
                open={open}
                onOpenChange={setOpen}
            />
        </PageContainer>

    );

}