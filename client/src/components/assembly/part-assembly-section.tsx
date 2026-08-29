import { useState } from "react";
import { LoadingState } from "@/components/ui/spinner";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
    PartAssemblyToolbar,
    PartAssembliesTable,
    PartAssembliesEmptyState,
    PartAssemblyModal,
    PartAssemblyViewModal,
    ConfirmPartAssemblyDialog,
    DeletePartAssemblyDialog
} from "@/components";
import {
    usePartAssemblies,
    useConfirmPartAssembly,
    useDeletePartAssembly,
    usePagination
} from "@/hooks";
import { PaginationControls } from "@/components/ui";
import type { PartAssembly } from "@/types";

export function PartAssemblySection() {

    const { data, isLoading, isError } = usePartAssemblies();
    const assemblies = data?.data ?? [];
    const { pageItems: pagedAssemblies, page, setPage, totalPages, totalItems, pageSize } = usePagination(assemblies);

    const [open, setOpen] = useState(false);
    const [selectedAssembly, setSelectedAssembly] = useState<PartAssembly | null>(null);
    const [assemblyToView, setAssemblyToView] = useState<PartAssembly | null>(null);
    const [assemblyToConfirm, setAssemblyToConfirm] = useState<PartAssembly | null>(null);
    const [assemblyToDelete, setAssemblyToDelete] = useState<PartAssembly | null>(null);

    const confirmMutation = useConfirmPartAssembly();
    const deleteMutation = useDeletePartAssembly();

    return (
        <>
            <div className="mt-6">
                <PartAssemblyToolbar onNewAssembly={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar los ensamblajes.</p>}
                {!isLoading && !isError && (
                    assemblies.length === 0
                        ? <PartAssembliesEmptyState />
                        : (
                            <>
                                <PartAssembliesTable
                                    assemblies={pagedAssemblies}
                                    onView={(assembly) => setAssemblyToView(assembly)}
                                    onEdit={(assembly) => {
                                        setSelectedAssembly(assembly);
                                        setOpen(true);
                                    }}
                                    onConfirm={(assembly) => setAssemblyToConfirm(assembly)}
                                    onDelete={(assembly) => setAssemblyToDelete(assembly)}
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

            <PartAssemblyModal
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setSelectedAssembly(null);
                    }
                }}
                mode={selectedAssembly ? "edit" : "create"}
                assemblyId={selectedAssembly?.id}
            />

            <PartAssemblyViewModal
                open={!!assemblyToView}
                assembly={assemblyToView}
                onOpenChange={(value) => {
                    if (!value) {
                        setAssemblyToView(null);
                    }
                }}
            />
            <ConfirmPartAssemblyDialog
                open={!!assemblyToConfirm}
                loading={confirmMutation.isPending}
                onOpenChange={(value) => {
                    if (!value) {
                        setAssemblyToConfirm(null);
                    }
                }}
                onConfirm={() => {
                    if (!assemblyToConfirm) {
                        return;
                    }
                    confirmMutation.mutate(assemblyToConfirm.id, {
                        onSuccess: () => {
                            toast.success("Ensamblaje confirmado: inventario actualizado.");
                            setAssemblyToConfirm(null);
                        },
                        onError: (error) => {
                            const message =
                                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                                    ? error.response.data.message
                                    : "No se pudo confirmar el ensamblaje.";
                            toast.error(message);
                        }
                    });
                }}
            />
            <DeletePartAssemblyDialog
                open={!!assemblyToDelete}
                loading={deleteMutation.isPending}
                onOpenChange={(value) => {
                    if (!value) {
                        setAssemblyToDelete(null);
                    }
                }}
                onConfirm={() => {
                    if (!assemblyToDelete) {
                        return;
                    }
                    deleteMutation.mutate(assemblyToDelete.id, {
                        onSuccess: () => {
                            toast.success("Ensamblaje eliminado.");
                            setAssemblyToDelete(null);
                        },
                        onError: (error) => {
                            const message =
                                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                                    ? error.response.data.message
                                    : "No se pudo eliminar el ensamblaje.";
                            toast.error(message);
                        }
                    });
                }}
            />

        </>
    );

}