import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    BrandsToolbar,
    BrandsTable,
    BrandsEmptyState,
    BrandModal,
    DeleteBrandDialog
} from "@/components";
import { useBrands, useDeleteBrand } from "@/hooks";
import type { Brand } from "@/types";
import { LoadingState } from "@/components/ui/spinner";

export function BrandsPage() {

    const { data, isLoading, isError } = useBrands();
    const deleteMutation = useDeleteBrand();
    const brands = data?.data ?? [];
    const [open, setOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

    return (
        <PageContainer>

            <PageHeader
                title="Marcas"
                description="Administra las marcas de los productos."
            />

            <div className="mt-8">
                <BrandsToolbar onNewBrand={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar las marcas.</p>}
                {!isLoading && !isError && (
                    brands.length === 0
                        ? <BrandsEmptyState />
                        : (
                            <BrandsTable
                                brands={brands}
                                onDelete={(brand) => setBrandToDelete(brand)}
                            />
                        )
                )}
            </div>

            <BrandModal open={open} onOpenChange={setOpen} />

            <DeleteBrandDialog
                open={!!brandToDelete}
                brandName={brandToDelete?.name ?? ""}
                onCancel={() => setBrandToDelete(null)}
                onConfirm={() => {
                    if (!brandToDelete) {
                        return;
                    }
                    deleteMutation.mutate(brandToDelete.id, {
                        onSuccess: () => setBrandToDelete(null)
                    });
                }}
            />

        </PageContainer>
    );
}
