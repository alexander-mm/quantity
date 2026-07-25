import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    ProductStoreSelector,
    KardexTable,
    KardexSkeleton,
    KardexErrorState,
    KardexEmptyState
} from "@/components";
import {
    useProducts,
    useStores,
    useKardex
} from "@/hooks";

export function KardexPage() {

    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedStore, setSelectedStore] = useState("");

    const [productId, setProductId] = useState<string>();
    const [storeId, setStoreId] = useState<string>();

    const { data: productsData } = useProducts();
    const { data: storesData } = useStores();

    const {
        data,
        isLoading,
        isError
    } = useKardex(
        productId,
        storeId
    );

    const products = productsData?.data ?? [];
    const stores = storesData?.data ?? [];
    const movements = data?.data ?? [];

    return (

        <PageContainer>

            <PageHeader
                title="Kardex"
                description="Consulta el historial de movimientos de un producto."
            />

            <div className="mt-6">

                <ProductStoreSelector
                    products={products}
                    stores={stores}
                    productId={selectedProduct}
                    storeId={selectedStore}
                    onProductChange={(value) => {
                        setSelectedProduct(value ?? "");
                    }}
                    onStoreChange={(value) => {
                        setSelectedStore(value ?? "");
                    }}
                    onSearch={() => {
                        setProductId(selectedProduct);
                        setStoreId(selectedStore);
                    }}
                />

            </div>

            <div className="mt-6">

                {
                    isLoading
                        ? (
                            <KardexSkeleton />
                        )
                        : isError
                            ? (
                                <KardexErrorState />
                            )
                            : movements.length === 0
                                ? (
                                    <KardexEmptyState />
                                )
                                : (
                                    <>
                                        <KardexTable
                                            movements={movements}
                                        />

                                        <p className="mt-4 text-sm text-muted-foreground">
                                            Mostrando {movements.length} movimientos
                                        </p>
                                    </>
                                )
                }

            </div>

        </PageContainer>

    );

}