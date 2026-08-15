import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    PartAdjustmentsToolbar,
    PartAdjustmentsTable,
    PartAdjustmentsEmptyState,
    PartAdjustmentModal
} from "@/components";
import { usePartAdjustments } from "@/hooks";

export function PartAdjustmentsPage() {

    const { data, isLoading, isError } = usePartAdjustments();
    const adjustments = data?.data ?? [];
    const [open, setOpen] = useState(false);

    return (
        <PageContainer>

            <PageHeader
                title="Ajustes de piezas"
                description="Corrige el stock de piezas por conteos físicos, daños o pérdidas."
            />

            <div className="mt-8">
                <PartAdjustmentsToolbar onNewAdjustment={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los ajustes.</p>}
                {!isLoading && !isError && (
                    adjustments.length === 0
                        ? <PartAdjustmentsEmptyState />
                        : <PartAdjustmentsTable adjustments={adjustments} />
                )}
            </div>

            <PartAdjustmentModal open={open} onOpenChange={setOpen} />

        </PageContainer>
    );
}
