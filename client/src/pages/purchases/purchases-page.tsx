import { PageContainer, PageHeader, PurchasesToolbar, PurchasesTable, PurchaseModal, PurchaseViewModal } from "@/components";
import { usePurchases } from "@/hooks";
import { useState, useMemo } from "react";
import type { Purchase } from "@/types";

export function PurchasesPage() {

    const {
        data,
        isLoading,
        isError
    } = usePurchases();

    const [search, setSearch] = useState("");

    const purchases = useMemo(() => {
        const list = data?.data ?? [];
        if (!search) return list;
        const term = search.toLowerCase();
        return list.filter(p =>
            p.number.toLowerCase().includes(term) ||
            p.supplier.companyName.toLowerCase().includes(term) ||
            p.store.name.toLowerCase().includes(term)
        );
    }, [data, search]);

    const [open, setOpen] =
        useState(false);

    const [
        purchaseToView,
        setPurchaseToView
    ] = useState<Purchase | null>(null);

    if (isLoading) {

        return (

            <PageContainer>

                <PageHeader
                    title="Compras"
                    description="Administra las compras del inventario."
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
                    title="Compras"
                    description="Administra las compras del inventario."
                />

                <p className="mt-6">
                    Error al cargar las compras.
                </p>

            </PageContainer>

        );

    }

    return (

        <PageContainer>

            <PageHeader
                title="Compras"
                description="Administra las compras del inventario."
            />

            <div className="mt-8">

                <PurchasesToolbar
                    onNewPurchase={() => {
                        setOpen(true);
                    }}
                    search={search}
                    onSearchChange={setSearch}
                />

            </div>

            <div className="mt-6">

                {
                    purchases.length === 0
                        ? (
                            <div className="rounded-xl border border-dashed p-12 text-center">
                                <h2 className="text-xl font-semibold">
                                    No existen compras registradas
                                </h2>

                                <p className="mt-2 text-muted-foreground">
                                    Haz clic en "Nueva compra" para registrar la primera.
                                </p>
                            </div>
                        )
                        : (
                            <>
                                <PurchasesTable
                                    purchases={purchases}
                                    onView={(purchase) => {

                                        setPurchaseToView(
                                            purchase
                                        );

                                    }}
                                />

                                <p className="mt-4 text-sm text-muted-foreground">
                                    Mostrando {purchases.length} compras
                                </p>
                            </>
                        )
                }

            </div>

            <PurchaseModal
                open={open}
                onOpenChange={setOpen}
            />

            <PurchaseViewModal
                open={
                    !!purchaseToView
                }
                purchase={
                    purchaseToView
                }
                onOpenChange={() =>
                    setPurchaseToView(null)
                }
            />

        </PageContainer>

    );

}