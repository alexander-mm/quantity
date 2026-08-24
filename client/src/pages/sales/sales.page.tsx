import { PageContainer, PageHeader, SalesToolbar, SalesTable, SaleModal, SaleViewModal } from "@/components";
import { useSales, useStores } from "@/hooks";
import { useMemo, useState } from "react";
import type { Sale } from "@/types";
import { getClientLabel } from "@/lib/client-label";

export function SalesPage() {

    const {
        data,
        isLoading,
        isError
    } = useSales();

    const { data: storesData } = useStores();
    const stores = storesData?.data ?? [];

    const [search, setSearch] = useState("");
    const [storeFilter, setStoreFilter] = useState("");

    const sales = useMemo(() => {

        let list = data?.data ?? [];

        if (storeFilter) {
            list = list.filter(sale => sale.store.id === storeFilter);
        }

        if (!search) {
            return list;
        }

        const term = search.toLowerCase();

        return list.filter(sale =>
            sale.number.toLowerCase().includes(term) ||
            sale.store.name.toLowerCase().includes(term) ||
            getClientLabel(sale.client).toLowerCase().includes(term)
        );

    }, [data, search, storeFilter]);

    const [open, setOpen] =
        useState(false);

    const [
        saleToView,
        setSaleToView
    ] = useState<Sale | null>(null);

    const [
        saleToEdit,
        setSaleToEdit
    ] = useState<Sale | null>(null);

    return (

        <PageContainer>

            <PageHeader
                title="Ventas"
                description="Administra las ventas del inventario."
            />

            <div className="mt-8">

                <SalesToolbar
                    onNewSale={() => {
                        setOpen(true);
                    }}
                    search={search}
                    onSearchChange={setSearch}
                    stores={stores}
                    storeId={storeFilter}
                    onStoreChange={setStoreFilter}
                />

            </div>

            <div className="mt-6">

                {isLoading && (
                    <p>Cargando...</p>
                )}

                {!isLoading && isError && (
                    <p>
                        Error al cargar las ventas.
                        {!navigator.onLine && " Estás sin conexión — el historial no está disponible, pero aún necesitas conexión para guardar una venta nueva."}
                    </p>
                )}

                {!isLoading && !isError && (

                    sales.length === 0
                        ? (
                            <div className="rounded-xl border border-dashed p-12 text-center">
                                <h2 className="text-xl font-semibold">
                                    No existen ventas registradas
                                </h2>

                                <p className="mt-2 text-muted-foreground">
                                    Haz clic en "Nueva venta" para registrar la primera.
                                </p>
                            </div>
                        )
                        : (
                            <>
                                <SalesTable
                                    sales={sales}
                                    onView={(sale) => {

                                        setSaleToView(
                                            sale
                                        );

                                    }}
                                    onEdit={(sale) => {

                                        setSaleToEdit(
                                            sale
                                        );

                                    }}
                                />

                                <p className="mt-4 text-sm text-muted-foreground">
                                    Mostrando {sales.length} ventas
                                </p>
                            </>
                        )

                )}

            </div>

            <SaleModal
                open={open}
                onOpenChange={setOpen}
            />

            <SaleModal
                open={!!saleToEdit}
                sale={saleToEdit}
                onOpenChange={() => setSaleToEdit(null)}
            />

            <SaleViewModal
                open={
                    !!saleToView
                }
                sale={
                    saleToView
                }
                onOpenChange={() =>
                    setSaleToView(null)
                }
            />

        </PageContainer>

    );

}
