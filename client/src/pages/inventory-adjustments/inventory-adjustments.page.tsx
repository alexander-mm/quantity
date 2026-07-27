import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    InventoryAdjustmentsToolbar,
    InventoryAdjustmentsTable,
    InventoryAdjustmentsEmptyState,
    InventoryAdjustmentModal
} from "@/components";
import { useInventoryAdjustments } from "@/hooks";

export function InventoryAdjustmentsPage() {

    const { data, isLoading, isError } = useInventoryAdjustments();
    const adjustments = data?.data ?? [];
    const [open, setOpen] = useState(false);

    return (
        <PageContainer>

            <PageHeader
                title="Ajustes de inventario"
                description="Corrige el stock por conteos físicos, daños o pérdidas."
            />

            <div className="mt-8">
                <InventoryAdjustmentsToolbar onNewAdjustment={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los ajustes.</p>}
                {!isLoading && !isError && (
                    adjustments.length === 0
                        ? <InventoryAdjustmentsEmptyState />
                        : <InventoryAdjustmentsTable adjustments={adjustments} />
                )}
            </div>

            <InventoryAdjustmentModal open={open} onOpenChange={setOpen} />

        </PageContainer>
    );
}