import {
    PageContainer,
    PageHeader,
    InventoryStockTable
} from "@/components";
import { useInventoryStock } from "@/hooks";

export function InventoryStockPage() {

    const {
        data,
        isLoading,
        isError
    } = useInventoryStock();

    const stock = data?.data ?? [];

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader
                    title="Inventario"
                    description="Consulta las existencias actuales por tienda."
                />
                <p className="mt-6">
                    Cargando inventario...
                </p>
            </PageContainer>
        );
    }

    if (isError) {
        return (
            <PageContainer>
                <PageHeader
                    title="Inventario"
                    description="Consulta las existencias actuales por tienda."
                />
                <p className="mt-6 text-red-500">
                    Error al cargar el inventario.
                </p>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Inventario"
                description="Consulta las existencias actuales por tienda."
            />
            <div className="mt-6">
                <InventoryStockTable
                    stock={stock}
                />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
                Mostrando {stock.length} registros
            </p>
        </PageContainer>
    );

}