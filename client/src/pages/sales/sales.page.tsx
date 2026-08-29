import { PageContainer, PageHeader, SalesToolbar, SalesTable, SaleModal, SaleViewModal } from "@/components";
import type { PrefillFromQuote } from "@/components/sales/sale-form";
import { PaginationControls, LoadingState } from "@/components/ui";
import { useSales, useStores, usePagination } from "@/hooks";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

    const location = useLocation();
    const navigate = useNavigate();
    const [prefill, setPrefill] = useState<PrefillFromQuote | undefined>(undefined);

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

    useEffect(() => {

        const state = location.state as { prefillFromQuote?: PrefillFromQuote } | null;

        if (state?.prefillFromQuote) {
            setPrefill(state.prefillFromQuote);
            setOpen(true);
            navigate(location.pathname, { replace: true, state: null });
        }

    }, [location, navigate]);

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

    const { pageItems: pagedSales, page, setPage, totalPages, totalItems, pageSize } = usePagination(sales);

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

                {isLoading && <LoadingState />}

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
                                    sales={pagedSales}
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

                                <PaginationControls
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    totalItems={totalItems}
                                    pageSize={pageSize}
                                />
                            </>
                        )

                )}

            </div>

            <SaleModal
                open={open}
                prefill={prefill}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setPrefill(undefined);
                    }
                }}
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
