import { useMemo, useState } from "react";
import {
    PageContainer,
    PageHeader,
    InventoryStockTable
} from "@/components";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { PaginationControls } from "@/components/ui";
import { StoreSelector } from "@/components/selectors/store-selector";
import { useInventoryStock, useLowStock, useStores, usePagination } from "@/hooks";
import { ALL_STORES_SUMMED } from "@/constants/inventory";
import type { InventoryStock } from "@/types";

export function InventoryStockPage() {

    const [onlyLowStock, setOnlyLowStock] = useState(false);
    const [search, setSearch] = useState("");
    const [storeId, setStoreId] = useState("");

    const allStockQuery = useInventoryStock();
    const lowStockQuery = useLowStock();
    const { data: storesData } = useStores();
    const stores = storesData?.data ?? [];

    const {
        data,
        isLoading,
        isError
    } = onlyLowStock ? lowStockQuery : allStockQuery;

    const filteredStock = useMemo(() => {

        const list = data?.data ?? [];
        const term = search.toLowerCase();

        const matchesSearch = (item: InventoryStock) =>
            !term ||
            item.product.name.toLowerCase().includes(term) ||
            item.product.internalCode.toLowerCase().includes(term);

        if (storeId === ALL_STORES_SUMMED) {

            // Un renglón por producto, con la existencia sumada de todas las
            // tiendas y bodegas (no filtra por tienda: junta lo que haya en
            // cualquiera de ellas).
            const totals = new Map<string, InventoryStock>();

            for (const item of list) {

                if (!matchesSearch(item)) {
                    continue;
                }

                const existing = totals.get(item.product.id);

                if (existing) {
                    existing.quantity = String(Number(existing.quantity) + Number(item.quantity));
                } else {
                    totals.set(item.product.id, {
                        id: item.product.id,
                        quantity: item.quantity,
                        product: item.product,
                        store: { id: ALL_STORES_SUMMED, name: "Todas las tiendas" }
                    });
                }

            }

            return Array.from(totals.values());

        }

        return list.filter(item => {

            const matchesStore =
                !storeId ||
                item.store.id === storeId;

            return matchesSearch(item) && matchesStore;

        });

    }, [data, search, storeId]);

    const { pageItems: pagedStock, page, setPage, totalPages, totalItems, pageSize } = usePagination(filteredStock);

    return (
        <PageContainer>
            <PageHeader
                title="Admin. de Inventario"
                description="Consulta las existencias actuales por tienda."
            />

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

                <div className="flex flex-col gap-4 md:flex-1 md:flex-row md:items-end">

                    <SearchInput
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={setSearch}
                        className="max-w-sm"
                    />

                    <div className="w-full max-w-xs">
                        <StoreSelector
                            stores={stores}
                            value={storeId}
                            label="Tienda"
                            placeholder="Todas las tiendas"
                            onChange={(value) => setStoreId(value ?? "")}
                            aggregateOption={{
                                value: ALL_STORES_SUMMED,
                                label: "Total (todas las tiendas)"
                            }}
                        />
                    </div>

                </div>

                <Button
                    variant={onlyLowStock ? "default" : "outline"}
                    onClick={() => setOnlyLowStock(prev => !prev)}
                >
                    {onlyLowStock ? "Mostrando solo stock bajo" : "Solo stock bajo"}
                </Button>

            </div>

            {isLoading && (
                <p className="mt-6">
                    Cargando inventario...
                </p>
            )}

            {isError && (
                <p className="mt-6 text-red-500">
                    Error al cargar el inventario.
                </p>
            )}

            {!isLoading && !isError && (
                <>
                    <div className="mt-6">
                        <InventoryStockTable
                            stock={pagedStock}
                        />
                    </div>
                    <PaginationControls
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        totalItems={totalItems}
                        pageSize={pageSize}
                    />
                </>
            )}
        </PageContainer>
    );

}
