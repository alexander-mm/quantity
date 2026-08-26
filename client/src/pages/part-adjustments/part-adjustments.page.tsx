import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    PartAdjustmentsToolbar,
    PartAdjustmentsTable,
    PartAdjustmentsEmptyState,
    PartAdjustmentModal
} from "@/components";
import { PaginationControls } from "@/components/ui";
import { usePartAdjustments, usePagination } from "@/hooks";

export function PartAdjustmentsPage() {

    const { data, isLoading, isError } = usePartAdjustments();
    const adjustments = data?.data ?? [];
    const { pageItems: pagedAdjustments, page, setPage, totalPages, totalItems, pageSize } = usePagination(adjustments);
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
                        : (
                            <>
                                <PartAdjustmentsTable adjustments={pagedAdjustments} />
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

            <PartAdjustmentModal open={open} onOpenChange={setOpen} />

        </PageContainer>
    );
}
