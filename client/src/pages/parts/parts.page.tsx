import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
    PageContainer,
    PageHeader,
    PartsToolbar,
    PartsTable,
    PartsEmptyState,
    PartModal,
    DeletePartDialog
} from "@/components";
import { useParts, useDeletePart } from "@/hooks";
import type { Part } from "@/types";

export function PartsPage() {

    const { data, isLoading, isError } = useParts();
    const deleteMutation = useDeletePart();
    const [open, setOpen] = useState(false);
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [partToDelete, setPartToDelete] = useState<Part | null>(null);
    const [search, setSearch] = useState("");

    const parts = useMemo(() => {

        const list = data?.data ?? [];

        if (!search) {
            return list;
        }

        const term = search.toLowerCase();

        return list.filter(part =>
            part.name.toLowerCase().includes(term) ||
            part.code.toLowerCase().includes(term)
        );

    }, [data, search]);

    return (
        <PageContainer>

            <PageHeader
                title="Piezas"
                description="Catálogo de piezas de metal fabricadas por producción."
            />

            <div className="mt-8">
                <PartsToolbar
                    onNewPart={() => setOpen(true)}
                    search={search}
                    onSearchChange={setSearch}
                />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar las piezas.</p>}
                {!isLoading && !isError && (
                    parts.length === 0
                        ? <PartsEmptyState />
                        : (
                            <PartsTable
                                parts={parts}
                                onEdit={(part) => {
                                    setSelectedPart(part);
                                    setOpen(true);
                                }}
                                onDelete={(part) => setPartToDelete(part)}
                            />
                        )
                )}
            </div>

            <PartModal
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setSelectedPart(null);
                    }
                }}
                mode={selectedPart ? "edit" : "create"}
                partId={selectedPart?.id}
            />

            <DeletePartDialog
                open={!!partToDelete}
                partName={partToDelete?.name ?? ""}
                onCancel={() => setPartToDelete(null)}
                onConfirm={() => {
                    if (!partToDelete) {
                        return;
                    }
                    deleteMutation.mutate(partToDelete.id, {
                        onSuccess: () => setPartToDelete(null),
                        onError: (error) => {
                            const message =
                                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                                    ? error.response.data.message
                                    : "No se pudo eliminar la pieza.";
                            toast.error(message);
                            setPartToDelete(null);
                        }
                    });
                }}
            />

        </PageContainer>
    );
}
