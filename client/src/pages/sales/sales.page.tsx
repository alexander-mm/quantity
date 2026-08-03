import { PageContainer, PageHeader, SalesToolbar, SalesTable, SaleModal, SaleViewModal } from "@/components";
import { useSales } from "@/hooks";
import { useMemo, useState } from "react";
import type { Sale } from "@/types";
import { getClientLabel } from "@/lib/client-label";

export function SalesPage() {

    const {
        data,
        isLoading,
        isError
    } = useSales();

    const [search, setSearch] = useState("");

    const sales = useMemo(() => {

        const list = data?.data ?? [];

        if (!search) {
            return list;
        }

        const term = search.toLowerCase();

        return list.filter(sale =>
            sale.number.toLowerCase().includes(term) ||
            sale.store.name.toLowerCase().includes(term) ||
            getClientLabel(sale.client).toLowerCase().includes(term)
        );

    }, [data, search]);

    const [open, setOpen] =
        useState(false);

    const [
        saleToView,
        setSaleToView
    ] = useState<Sale | null>(null);

    if (isLoading) {

        return (

            <PageContainer>

                <PageHeader
                    title="Ventas"
                    description="Administra las ventas del inventario."
                />

                <p className="mt-6">
                    Cargando...
                </p>

            </PageContainer>

        );

    }

    if (isError) {

        return (

            <PageContainer>

                <PageHeader
                    title="Ventas"
                    description="Administra las ventas del inventario."
                />

                <p className="mt-6">
                    Error al cargar las ventas.
                </p>

            </PageContainer>

        );

    }

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
                />

            </div>

            <div className="mt-6">

                {
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
                                />

                                <p className="mt-4 text-sm text-muted-foreground">
                                    Mostrando {sales.length} ventas
                                </p>
                            </>
                        )
                }

            </div>

            <SaleModal
                open={open}
                onOpenChange={setOpen}
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
