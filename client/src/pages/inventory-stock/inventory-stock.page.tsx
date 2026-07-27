import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    InventoryStockTable
} from "@/components";
import { Button } from "@/components/ui/button";
import { useInventoryStock, useLowStock } from "@/hooks";

export function InventoryStockPage() {

    const [onlyLowStock, setOnlyLowStock] = useState(false);

    const allStockQuery = useInventoryStock();
    const lowStockQuery = useLowStock();

    const {
        data,
        isLoading,
        isError
    } = onlyLowStock ? lowStockQuery : allStockQuery;

    const stock = data?.data ?? [];

    return (
        <PageContainer>
            <PageHeader
                title="Inventario"
                description="Consulta las existencias actuales por tienda."
            />

            <div className="mt-6 flex justify-end">
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
                            stock={stock}
                        />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Mostrando {stock.length} registros
                    </p>
                </>
            )}
        </PageContainer>
    );

}