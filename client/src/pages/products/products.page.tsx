import { PageContainer, PageHeader, } from "@/components";
import { ProductsToolbar, ProductsTable } from "@/components";
import { useProducts } from "@/hooks/products";

export function ProductsPage() {

    const { data } = useProducts();
    const products = data?.data ?? [];

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
                <ProductsTable
                    products={products}
                />
            </div>
        </PageContainer>

    );

}