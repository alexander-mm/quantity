import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    UnitsOfMeasureToolbar,
    UnitsOfMeasureTable,
    UnitsOfMeasureEmptyState,
    UnitOfMeasureModal
} from "@/components";
import { useUnitsOfMeasure } from "@/hooks";

export function UnitsOfMeasurePage() {

    const { data, isLoading, isError } = useUnitsOfMeasure();
    const units = data?.data ?? [];
    const [open, setOpen] = useState(false);

    return (
        <PageContainer>

            <PageHeader
                title="Unidades de medida"
                description="Administra las unidades de medida de los productos."
            />

            <div className="mt-8">
                <UnitsOfMeasureToolbar onNewUnit={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar las unidades de medida.</p>}
                {!isLoading && !isError && (
                    units.length === 0
                        ? <UnitsOfMeasureEmptyState />
                        : <UnitsOfMeasureTable units={units} />
                )}
            </div>

            <UnitOfMeasureModal open={open} onOpenChange={setOpen} />

        </PageContainer>
    );
}
