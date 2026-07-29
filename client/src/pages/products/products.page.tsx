import {
    PageContainer,
    PageHeader,
    ProductsToolbar,
    ProductsTable,
    ProductsTableSkeleton,
    ProductsErrorState,
    ProductsEmptyState,
    ProductFormModal,
    DeleteProductDialog,
    ProductViewModal
} from "@/components";
import { useState } from "react";
import { useProducts, useDeleteProduct } from "@/hooks";
import type { Product } from "@/types";

export function ProductsPage() {

    const { data, isLoading, isError } = useProducts();
    const deleteProductMutation = useDeleteProduct();
    const products = data?.data ?? [];
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [productToView, setProductToView] = useState<Product | null>(null);

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader
                    title="Productos"
                    description="Administra los productos del sistema."
                />
                <div className="mt-8">
                    <ProductsToolbar
                        onNewProduct={() => setOpen(true)}
                    />
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
                <ProductsToolbar
                    onNewProduct={() => setOpen(true)}
                />
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
                                    onView={(product) => setProductToView(product)}
                                    onEdit={(product) => {
                                        setSelectedProduct(product);
                                        setOpen(true);

                                    }}
                                    onDelete={(product) => {

                                        setProductToDelete(product);
                                    }}
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Mostrando {products.length} productos
                                </p>
                            </>
                        )
                }
            </div>
            <ProductFormModal
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setSelectedProduct(null);
                    }
                }}
                mode={
                    selectedProduct
                        ? "edit"
                        : "create"
                }
                productId={selectedProduct?.id}
            />
            <DeleteProductDialog
                open={!!productToDelete}
                productName={productToDelete?.name ?? ""}
                onCancel={() => {
                    setProductToDelete(null);
                }}
                onConfirm={() => {
                    if (!productToDelete) {
                        return;
                    }
                    deleteProductMutation.mutate(
                        productToDelete.id,
                        {
                            onSuccess: () => {
                                setProductToDelete(null);
                            }
                        }
                    );
                }}
            />
            <ProductViewModal
                product={productToView}
                open={!!productToView}
                onOpenChange={(open) => {
                    if (!open) setProductToView(null);
                }}
            />
        </PageContainer>
    );
}