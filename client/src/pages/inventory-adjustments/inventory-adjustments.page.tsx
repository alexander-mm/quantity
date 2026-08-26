import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    InventoryAdjustmentsToolbar,
    InventoryAdjustmentsTable,
    InventoryAdjustmentsEmptyState,
    InventoryAdjustmentModal
} from "@/components";
import { PaginationControls } from "@/components/ui";
import { useInventoryAdjustments, usePagination } from "@/hooks";

export function InventoryAdjustmentsPage() {

    const { data, isLoading, isError } = useInventoryAdjustments();
    const adjustments = data?.data ?? [];
    const { pageItems: pagedAdjustments, page, setPage, totalPages, totalItems, pageSize } = usePagination(adjustments);
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
                        : (
                            <>
                                <InventoryAdjustmentsTable adjustments={pagedAdjustments} />
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

            <InventoryAdjustmentModal open={open} onOpenChange={setOpen} />

        </PageContainer>
    );
}