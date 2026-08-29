import { useState } from "react";
import { LoadingState } from "@/components/ui/spinner";
import {
    PageContainer,
    PageHeader,
    PartCategoriesToolbar,
    PartCategoriesTable,
    PartCategoriesEmptyState,
    PartCategoryModal,
    DeletePartCategoryDialog
} from "@/components";
import { usePartCategories, useDeletePartCategory } from "@/hooks";
import type { PartCategory } from "@/types";

export function PartCategoriesPage() {

    const { data, isLoading, isError } = usePartCategories();
    const deleteMutation = useDeletePartCategory();
    const categories = data?.data ?? [];
    const [open, setOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<PartCategory | null>(null);

    return (
        <PageContainer>

            <PageHeader
                title="Categorías de Piezas"
                description="Administra las categorías usadas para clasificar las piezas."
            />

            <div className="mt-8">
                <PartCategoriesToolbar onNewCategory={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar las categorías.</p>}
                {!isLoading && !isError && (
                    categories.length === 0
                        ? <PartCategoriesEmptyState />
                        : (
                            <PartCategoriesTable
                                categories={categories}
                                onDelete={(category) => setCategoryToDelete(category)}
                            />
                        )
                )}
            </div>

            <PartCategoryModal open={open} onOpenChange={setOpen} />

            <DeletePartCategoryDialog
                open={!!categoryToDelete}
                categoryName={categoryToDelete?.name ?? ""}
                onCancel={() => setCategoryToDelete(null)}
                onConfirm={() => {
                    if (!categoryToDelete) {
                        return;
                    }
                    deleteMutation.mutate(categoryToDelete.id, {
                        onSuccess: () => setCategoryToDelete(null)
                    });
                }}
            />

        </PageContainer>
    );
}
