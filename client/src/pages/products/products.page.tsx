import {
    PageContainer,
    PageHeader,
    ProductsToolbar,
    ProductsTable,
    ProductsTableSkeleton,
    ProductsErrorState,
    ProductsEmptyState
} from "@/components";

import { useProducts } from "@/hooks";

export function ProductsPage() {

    const {

        data,

        isLoading,

        isError

    } = useProducts();

    const products = data?.data ?? [];

    if (isLoading) {

        return (

            <PageContainer>

                <PageHeader
                    title="Productos"
                    description="Administra los productos del sistema."
                />
                <div className="mt-8">
                    <ProductsToolbar />
                </div>

                <div className="mt-6">
                    <ProductsTableSkeleton />
                </div>
            </PageContainer>
        );
    }

    if (isError) {

        return (
            <PageContainer>
                <PageHeader
                    title="Productos"
                    description="Administra los productos del sistema."
                />
                <div className="mt-6">
                    <ProductsErrorState />
                </div>
            </PageContainer>
        );
    }

    return (

        <PageContainer>

            <PageHeader
                title="Productos"
                description="Administra los productos del sistema."
            />
            <div className="mt-8">
                <ProductsToolbar />
            </div>

            <div className="mt-6">
                {
                    products.length === 0
                        ? (
                            <ProductsEmptyState />
                        )
                        : (
                            <>
                                <ProductsTable
                                    products={products}
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Mostrando {products.length} productos
                                </p>
                            </>
                        )
                }
            </div>
        </PageContainer>

    );

}