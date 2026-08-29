import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    CategoriesToolbar,
    CategoriesTable,
    CategoriesEmptyState,
    CategoryModal,
    DeleteCategoryDialog
} from "@/components";
import { useCategories, useDeleteCategory } from "@/hooks";
import type { Category } from "@/types";
import { LoadingState } from "@/components/ui/spinner";

export function CategoriesPage() {

    const { data, isLoading, isError } = useCategories();
    const deleteMutation = useDeleteCategory();
    const categories = data?.data ?? [];
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    return (
        <PageContainer>

            <PageHeader
                title="Categorías"
                description="Administra las categorías de los productos."
            />

            <div className="mt-8">
                <CategoriesToolbar onNewCategory={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar las categorías.</p>}
                {!isLoading && !isError && (
                    categories.length === 0
                        ? <CategoriesEmptyState />
                        : (
                            <CategoriesTable
                                categories={categories}
                                onEdit={(category) => {
                                    setSelected(category);
                                    setOpen(true);
                                }}
                                onDelete={(category) => setCategoryToDelete(category)}
                            />
                        )
                )}
            </div>

            <CategoryModal
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setSelected(null);
                    }
                }}
                mode={selected ? "edit" : "create"}
                categoryId={selected?.id}
            />

            <DeleteCategoryDialog
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
