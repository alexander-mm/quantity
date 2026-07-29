import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    CategoriesToolbar,
    CategoriesTable,
    CategoriesEmptyState,
    CategoryModal
} from "@/components";
import { useCategories } from "@/hooks";

export function CategoriesPage() {

    const { data, isLoading, isError } = useCategories();
    const categories = data?.data ?? [];
    const [open, setOpen] = useState(false);

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
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar las categorías.</p>}
                {!isLoading && !isError && (
                    categories.length === 0
                        ? <CategoriesEmptyState />
                        : <CategoriesTable categories={categories} />
                )}
            </div>

            <CategoryModal open={open} onOpenChange={setOpen} />

        </PageContainer>
    );
}
