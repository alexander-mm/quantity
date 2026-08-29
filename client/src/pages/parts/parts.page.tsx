import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
    PageContainer,
    PageHeader,
    PartsToolbar,
    PartsTable,
    PartsEmptyState,
    PartModal,
    PartViewModal,
    DeletePartDialog
} from "@/components";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/ui";
import { useParts, useLowStockParts, useDeletePart, usePartCategories, usePagination } from "@/hooks";
import type { Part } from "@/types";
import { LoadingState } from "@/components/ui/spinner";

export function PartsPage() {

    const [onlyLowStock, setOnlyLowStock] = useState(false);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [partToView, setPartToView] = useState<Part | null>(null);
    const [partToDelete, setPartToDelete] = useState<Part | null>(null);

    const allQuery = useParts();
    const lowStockQuery = useLowStockParts();
    const deleteMutation = useDeletePart();
    const { data: categoriesData } = usePartCategories();
    const categories = categoriesData?.data ?? [];

    const { data, isLoading, isError } = onlyLowStock ? lowStockQuery : allQuery;

    const lowStockCount = lowStockQuery.data?.data.length ?? 0;
    const hasWarnedRef = useRef(false);

    useEffect(() => {

        if (hasWarnedRef.current || !lowStockQuery.data) {
            return;
        }

        hasWarnedRef.current = true;

        if (lowStockCount > 0) {
            toast(
                `Hay ${lowStockCount} pieza${lowStockCount === 1 ? "" : "s"} con stock bajo.`,
                { icon: "⚠️" }
            );
        }

    }, [lowStockQuery.data, lowStockCount]);

    const parts = useMemo(() => {

        let list = data?.data ?? [];

        if (categoryFilter) {
            list = list.filter(part => part.categoryId === categoryFilter);
        }

        if (!search) {
            return list;
        }

        const term = search.toLowerCase();

        return list.filter(part =>
            part.name.toLowerCase().includes(term) ||
            part.code.toLowerCase().includes(term)
        );

    }, [data, search, categoryFilter]);

    const { pageItems: pagedParts, page, setPage, totalPages, totalItems, pageSize } = usePagination(parts);

    return (
        <PageContainer>

            <PageHeader
                title="Admin. de Piezas"
                description="Inventario de piezas de metal."
            />

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="flex-1">
                    <PartsToolbar
                        onNewPart={() => setOpen(true)}
                        search={search}
                        onSearchChange={setSearch}
                        categories={categories}
                        categoryId={categoryFilter}
                        onCategoryChange={setCategoryFilter}
                    />
                </div>

                <Button
                    type="button"
                    variant={onlyLowStock ? "default" : "outline"}
                    onClick={() => setOnlyLowStock(prev => !prev)}
                >
                    {onlyLowStock ? "Mostrando solo stock bajo" : `Solo stock bajo${lowStockCount > 0 ? ` (${lowStockCount})` : ""}`}
                </Button>

            </div>

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar las piezas.</p>}
                {!isLoading && !isError && (
                    parts.length === 0
                        ? <PartsEmptyState />
                        : (
                            <>
                                <PartsTable
                                    parts={pagedParts}
                                    onView={(part) => setPartToView(part)}
                                    onEdit={(part) => {
                                        setSelectedPart(part);
                                        setOpen(true);
                                    }}
                                    onDelete={(part) => setPartToDelete(part)}
                                />
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

            <PartModal
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setSelectedPart(null);
                    }
                }}
                mode={selectedPart ? "edit" : "create"}
                partId={selectedPart?.id}
            />

            <PartViewModal
                open={!!partToView}
                part={partToView}
                onOpenChange={(value) => {
                    if (!value) {
                        setPartToView(null);
                    }
                }}
            />

            <DeletePartDialog
                open={!!partToDelete}
                partName={partToDelete?.name ?? ""}
                onCancel={() => setPartToDelete(null)}
                onConfirm={() => {
                    if (!partToDelete) {
                        return;
                    }
                    deleteMutation.mutate(partToDelete.id, {
                        onSuccess: () => setPartToDelete(null),
                        onError: (error) => {
                            const message =
                                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                                    ? error.response.data.message
                                    : "No se pudo eliminar la pieza.";
                            toast.error(message);
                            setPartToDelete(null);
                        }
                    });
                }}
            />

        </PageContainer>
    );
}
