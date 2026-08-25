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
import { useProducts, useDeleteProduct, useStores, useInventoryStock, useKitAvailability } from "@/hooks";
import { ALL_STORES_SUMMED } from "@/constants/inventory";
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
    const isSpecificStore = !!storeId && storeId !== ALL_STORES_SUMMED;
    const { data: kitAvailabilityData } = useKitAvailability(isSpecificStore ? storeId : undefined);

    const stockByProductId = useMemo(() => {

        if (!storeId) {
            return undefined;
        }

        const map: Record<string, string> = {};
        const stockEntries = stockData?.data ?? [];

        if (storeId === ALL_STORES_SUMMED) {

            // Suma la existencia de todas las tiendas y bodegas por producto. La
            // disponibilidad de kits no se suma acá: un kit se arma con lo que
            // haya en una tienda puntual, no repartido entre varias.
            for (const item of stockEntries) {
                const current = Number(map[item.product.id] ?? 0);
                map[item.product.id] = String(current + Number(item.quantity));
            }

            return map;

        }

        stockEntries
            .filter(item => item.store.id === storeId)
            .forEach(item => {
                map[item.product.id] = item.quantity;
            });

        (kitAvailabilityData?.data ?? []).forEach(item => {
            map[item.productId] = `${item.quantity} (kit)`;
        });

        return map;

    }, [stockData, kitAvailabilityData, storeId]);

    const filteredProducts = useMemo(() => {

        const list = data?.data ?? [];

        if (!search) {
            return list;
        }

        const term = search.toLowerCase();

        return list.filter(product =>
            product.name.toLowerCase().includes(term) ||
            product.internalCode.toLowerCase().includes(term) ||
            (product.barcode?.toLowerCase().includes(term) ?? false)
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
