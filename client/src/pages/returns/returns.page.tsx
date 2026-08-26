import { useState } from "react";
import { Plus } from "lucide-react";
import { PageContainer, PageHeader, ReturnsTable, ReturnModal, ResolveReturnModal } from "@/components";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/ui";
import { useReturns, usePagination } from "@/hooks";
import type { Return } from "@/types";

export function ReturnsPage() {

    const { data, isLoading, isError } = useReturns();
    const allReturns = data?.data ?? [];

    const [open, setOpen] = useState(false);
    const [itemToView, setItemToView] = useState<Return | null>(null);
    const [onlyDamaged, setOnlyDamaged] = useState(false);

    const damagedCount = allReturns.filter(item => item.disposition === "DAMAGED").length;
    const returns = onlyDamaged ? allReturns.filter(item => item.disposition === "DAMAGED") : allReturns;

    const { pageItems: pagedReturns, page, setPage, totalPages, totalItems, pageSize } = usePagination(returns);

    return (
        <PageContainer>

            <PageHeader
                title="Devoluciones"
                description="Registra devoluciones de clientes y decide si el producto vuelve a stock o queda dañado."
            />

            <div className="mt-8 flex justify-between">
                <Button
                    type="button"
                    variant={onlyDamaged ? "default" : "outline"}
                    onClick={() => setOnlyDamaged(prev => !prev)}
                >
                    {onlyDamaged ? "Mostrando solo dañados" : `Solo dañados${damagedCount > 0 ? ` (${damagedCount})` : ""}`}
                </Button>

                <Button onClick={() => setOpen(true)}>
                    <Plus size={18} />
                    Nueva devolución
                </Button>
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar las devoluciones.</p>}
                {!isLoading && !isError && (
                    returns.length === 0
                        ? <p className="text-muted-foreground">No hay devoluciones {onlyDamaged ? "dañadas" : "registradas"}.</p>
                        : (
                            <>
                                <ReturnsTable returns={pagedReturns} onView={(item) => setItemToView(item)} />
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

            <ReturnModal open={open} onOpenChange={setOpen} />

            <ResolveReturnModal
                open={!!itemToView}
                item={itemToView}
                onOpenChange={(value) => {
                    if (!value) setItemToView(null);
                }}
            />

        </PageContainer>
    );
}
