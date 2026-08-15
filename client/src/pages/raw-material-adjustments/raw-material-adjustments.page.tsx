import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    RawMaterialAdjustmentsToolbar,
    RawMaterialAdjustmentsTable,
    RawMaterialAdjustmentsEmptyState,
    RawMaterialAdjustmentModal
} from "@/components";
import { useRawMaterialAdjustments } from "@/hooks";

export function RawMaterialAdjustmentsPage() {

    const { data, isLoading, isError } = useRawMaterialAdjustments();
    const adjustments = data?.data ?? [];
    const [open, setOpen] = useState(false);

    return (
        <PageContainer>

            <PageHeader
                title="Ajustes de materia prima"
                description="Corrige el stock de materia prima por conteos físicos, daños o pérdidas."
            />

            <div className="mt-8">
                <RawMaterialAdjustmentsToolbar onNewAdjustment={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los ajustes.</p>}
                {!isLoading && !isError && (
                    adjustments.length === 0
                        ? <RawMaterialAdjustmentsEmptyState />
                        : <RawMaterialAdjustmentsTable adjustments={adjustments} />
                )}
            </div>

            <RawMaterialAdjustmentModal open={open} onOpenChange={setOpen} />

        </PageContainer>
    );
}
