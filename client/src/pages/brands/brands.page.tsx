import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    BrandsToolbar,
    BrandsTable,
    BrandsEmptyState,
    BrandModal
} from "@/components";
import { useBrands } from "@/hooks";

export function BrandsPage() {

    const { data, isLoading, isError } = useBrands();
    const brands = data?.data ?? [];
    const [open, setOpen] = useState(false);

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
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar las marcas.</p>}
                {!isLoading && !isError && (
                    brands.length === 0
                        ? <BrandsEmptyState />
                        : <BrandsTable brands={brands} />
                )}
            </div>

            <BrandModal open={open} onOpenChange={setOpen} />

        </PageContainer>
    );
}
