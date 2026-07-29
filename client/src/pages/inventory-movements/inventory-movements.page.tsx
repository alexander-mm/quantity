import {
    PageContainer,
    PageHeader,
    InventoryMovementsTable,
    InventoryMovementsEmptyState,
    InventoryMovementModal,
    InventoryMovementsToolbar
} from "@/components";
import { useInventoryMovements } from "@/hooks";
import { useState, useMemo } from "react";

export function InventoryMovementsPage() {

    const {
        data,
        isLoading,
        isError
    } = useInventoryMovements();

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const movements = useMemo(() => {
        const list = data?.data ?? [];
        if (!search) return list;
        const term = search.toLowerCase();
        return list.filter(m =>
            m.product.name.toLowerCase().includes(term) ||
            m.movementType.name.toLowerCase().includes(term) ||
            m.store.name.toLowerCase().includes(term)
        );
    }, [data, search]);

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
                                    onView={() => { }}
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
