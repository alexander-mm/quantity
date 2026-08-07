import { useMemo, useState } from "react";
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
import { useRawMaterials, useDeleteRawMaterial } from "@/hooks";
import type { RawMaterial } from "@/types";

export function RawMaterialsPage() {

    const { data, isLoading, isError } = useRawMaterials();
    const deleteMutation = useDeleteRawMaterial();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<RawMaterial | null>(null);
    const [toDelete, setToDelete] = useState<RawMaterial | null>(null);
    const [search, setSearch] = useState("");

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
                title="Materia Prima"
                description="Láminas y tubos vírgenes usados para cortar piezas."
            />

            <div className="mt-8">
                <RawMaterialsToolbar
                    onNewRawMaterial={() => setOpen(true)}
                    search={search}
                    onSearchChange={setSearch}
                />
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
