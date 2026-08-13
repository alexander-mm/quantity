import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
    PageContainer,
    PageHeader,
    RawMaterialsToolbar,
    RawMaterialsTable,
    RawMaterialsEmptyState,
    RawMaterialModal,
    DeleteRawMaterialDialog
} from "@/components";
import { Button } from "@/components/ui/button";
import { useRawMaterials, useLowStockRawMaterials, useDeleteRawMaterial } from "@/hooks";
import type { RawMaterial } from "@/types";

export function RawMaterialsPage() {

    const [onlyLowStock, setOnlyLowStock] = useState(false);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<RawMaterial | null>(null);
    const [toDelete, setToDelete] = useState<RawMaterial | null>(null);

    const allQuery = useRawMaterials();
    const lowStockQuery = useLowStockRawMaterials();
    const deleteMutation = useDeleteRawMaterial();

    const { data, isLoading, isError } = onlyLowStock ? lowStockQuery : allQuery;

    const lowStockCount = lowStockQuery.data?.data.length ?? 0;
    const hasWarnedRef = useRef(false);

    useEffect(() => {

        if (hasWarnedRef.current || !lowStockQuery.data) {
            return;
        }

        hasWarnedRef.current = true;

        if (lowStockCount > 0) {
            toast(
                `Hay ${lowStockCount} materia${lowStockCount === 1 ? "" : "s"} prima${lowStockCount === 1 ? "" : "s"} con stock bajo.`,
                { icon: "⚠️" }
            );
        }

    }, [lowStockQuery.data, lowStockCount]);

    const rawMaterials = useMemo(() => {

        const list = data?.data ?? [];

        if (!search) {
            return list;
        }

        const term = search.toLowerCase();

        return list.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.code.toLowerCase().includes(term) ||
            item.material.toLowerCase().includes(term)
        );

    }, [data, search]);

    return (
        <PageContainer>

            <PageHeader
                title="Admin. de Materia Prima"
                description="Láminas, tubos y varillas vírgenes usados para cortar piezas."
            />

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="flex-1">
                    <RawMaterialsToolbar
                        onNewRawMaterial={() => setOpen(true)}
                        search={search}
                        onSearchChange={setSearch}
                    />
                </div>

                <Button
                    type="button"
                    variant={onlyLowStock ? "default" : "outline"}
                    onClick={() => setOnlyLowStock(prev => !prev)}
                >
                    {onlyLowStock ? "Mostrando solo stock bajo" : `Solo stock bajo${lowStockCount > 0 ? ` (${lowStockCount})` : ""}`}
                </Button>

            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar la materia prima.</p>}
                {!isLoading && !isError && (
                    rawMaterials.length === 0
                        ? <RawMaterialsEmptyState />
                        : (
                            <RawMaterialsTable
                                rawMaterials={rawMaterials}
                                onEdit={(item) => {
                                    setSelected(item);
                                    setOpen(true);
                                }}
                                onDelete={(item) => setToDelete(item)}
                            />
                        )
                )}
            </div>

            <RawMaterialModal
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setSelected(null);
                    }
                }}
                mode={selected ? "edit" : "create"}
                rawMaterialId={selected?.id}
            />

            <DeleteRawMaterialDialog
                open={!!toDelete}
                rawMaterialName={toDelete?.name ?? ""}
                onCancel={() => setToDelete(null)}
                onConfirm={() => {
                    if (!toDelete) {
                        return;
                    }
                    deleteMutation.mutate(toDelete.id, {
                        onSuccess: () => setToDelete(null),
                        onError: (error) => {
                            const message =
                                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                                    ? error.response.data.message
                                    : "No se pudo eliminar la materia prima.";
                            toast.error(message);
                            setToDelete(null);
                        }
                    });
                }}
            />

        </PageContainer>
    );
}
