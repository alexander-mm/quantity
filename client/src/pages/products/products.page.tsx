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
import { useMemo, useState } from "react";
import { useProducts, useDeleteProduct, useStores, useInventoryStock } from "@/hooks";
import type { Product } from "@/types";

export function ProductsPage() {

    const { data, isLoading, isError } = useProducts();
    const deleteProductMutation = useDeleteProduct();
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [productToView, setProductToView] = useState<Product | null>(null);
    const [search, setSearch] = useState("");
    const [storeId, setStoreId] = useState("");

    const { data: storesData } = useStores();
    const stores = storesData?.data ?? [];

    const { data: stockData } = useInventoryStock();

    const stockByProductId = useMemo(() => {

        if (!storeId) {
            return undefined;
        }

        const map: Record<string, string> = {};

        (stockData?.data ?? [])
            .filter(item => item.store.id === storeId)
            .forEach(item => {
                map[item.product.id] = item.quantity;
            });

        return map;

    }, [stockData, storeId]);

    const filteredProducts = useMemo(() => {

        const list = data?.data ?? [];

        if (!search) {
            return list;
        }

        const term = search.toLowerCase();

        return list.filter(product =>
            product.name.toLowerCase().includes(term) ||
            product.internalCode.toLowerCase().includes(term)
        );

    }, [data, search]);

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader
                    title="Admin. de Productos"
                    description="Administra los productos del sistema."
                />
                <div className="mt-8">
                    <ProductsToolbar
                        onNewProduct={() => setOpen(true)}
                        search={search}
                        onSearchChange={setSearch}
                        stores={stores}
                        storeId={storeId}
                        onStoreChange={setStoreId}
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
                    title="Admin. de Productos"
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
                title="Admin. de Productos"
                description="Administra los productos del sistema."
            />
            <div className="mt-8">
                <ProductsToolbar
                    onNewProduct={() => setOpen(true)}
                    search={search}
                    onSearchChange={setSearch}
                    stores={stores}
                    storeId={storeId}
                    onStoreChange={setStoreId}
                />
            </div>
            <div className="mt-6">
                {
                    filteredProducts.length === 0
                        ? (
                            <ProductsEmptyState />
                        )
                        : (
                            <>
                                <ProductsTable
                                    products={filteredProducts}
                                    stockByProductId={stockByProductId}
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
                                    Mostrando {filteredProducts.length} productos
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
