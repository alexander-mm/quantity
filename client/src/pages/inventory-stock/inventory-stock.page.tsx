import { useMemo, useState } from "react";
import {
    PageContainer,
    PageHeader,
    InventoryStockTable
} from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreSelector } from "@/components/selectors/store-selector";
import { useInventoryStock, useLowStock, useStores } from "@/hooks";

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

        return list.filter(item => {

            const matchesSearch =
                !term ||
                item.product.name.toLowerCase().includes(term) ||
                item.product.internalCode.toLowerCase().includes(term);

            const matchesStore =
                !storeId ||
                item.store.id === storeId;

            return matchesSearch && matchesStore;

        });

    }, [data, search, storeId]);

    return (
        <PageContainer>
            <PageHeader
                title="Admin. de Inventario"
                description="Consulta las existencias actuales por tienda."
            />

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

                <div className="flex flex-col gap-4 md:flex-1 md:flex-row md:items-end">

                    <div className="w-full max-w-sm">
                        <Input
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="w-full max-w-xs">
                        <StoreSelector
                            stores={stores}
                            value={storeId}
                            label="Tienda"
                            placeholder="Todas las tiendas"
                            onChange={(value) => setStoreId(value ?? "")}
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
                            stock={filteredStock}
                        />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Mostrando {filteredStock.length} registros
                    </p>
                </>
            )}
        </PageContainer>
    );

}
