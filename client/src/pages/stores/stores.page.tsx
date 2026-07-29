import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    StoresToolbar,
    StoresTable,
    StoresEmptyState,
    StoreFormModal,
    DeleteStoreDialog
} from "@/components";
import { useStores, useDeleteStore } from "@/hooks";
import type { Store } from "@/types";

export function StoresPage() {

    const { data, isLoading, isError } = useStores();
    const deleteStoreMutation = useDeleteStore();
    const stores = data?.data ?? [];
    const [open, setOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);

    return (
        <PageContainer>

            <PageHeader
                title="Tiendas"
                description="Administra las tiendas y la bodega principal."
            />

            <div className="mt-8">
                <StoresToolbar onNewStore={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar las tiendas.</p>}
                {!isLoading && !isError && (
                    stores.length === 0
                        ? <StoresEmptyState />
                        : (
                            <StoresTable
                                stores={stores}
                                onEdit={(store) => {
                                    setSelectedStore(store);
                                    setOpen(true);
                                }}
                                onDelete={(store) => {
                                    setStoreToDelete(store);
                                }}
                            />
                        )
                )}
            </div>

            <StoreFormModal
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setSelectedStore(null);
                    }
                }}
                mode={selectedStore ? "edit" : "create"}
                storeId={selectedStore?.id}
            />

            <DeleteStoreDialog
                open={!!storeToDelete}
                storeName={storeToDelete?.name ?? ""}
                onCancel={() => setStoreToDelete(null)}
                onConfirm={() => {
                    if (!storeToDelete) {
                        return;
                    }
                    deleteStoreMutation.mutate(storeToDelete.id, {
                        onSuccess: () => setStoreToDelete(null)
                    });
                }}
            />

        </PageContainer>
    );
}
