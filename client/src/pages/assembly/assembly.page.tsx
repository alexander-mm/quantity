import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
    PageContainer,
    PageHeader,
    AssemblyToolbar,
    AssembliesTable,
    AssembliesEmptyState,
    AssemblyModal,
    AssemblyViewModal,
    ConfirmAssemblyDialog,
    DeleteAssemblyDialog
} from "@/components";
import {
    useProductAssemblies,
    useConfirmProductAssembly,
    useDeleteProductAssembly
} from "@/hooks";
import type { ProductAssembly } from "@/types";

function getErrorMessage(error: unknown, fallback: string) {
    return axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
        ? error.response.data.message
        : fallback;
}

export function AssemblyPage() {

    const { data, isLoading, isError } = useProductAssemblies();
    const assemblies = data?.data ?? [];

    const [open, setOpen] = useState(false);
    const [selectedAssembly, setSelectedAssembly] = useState<ProductAssembly | null>(null);
    const [assemblyToView, setAssemblyToView] = useState<ProductAssembly | null>(null);
    const [assemblyToConfirm, setAssemblyToConfirm] = useState<ProductAssembly | null>(null);
    const [assemblyToDelete, setAssemblyToDelete] = useState<ProductAssembly | null>(null);

    const confirmMutation = useConfirmProductAssembly();
    const deleteMutation = useDeleteProductAssembly();

    return (
        <PageContainer>

            <PageHeader
                title="Ensamblaje de productos"
                description="Arma productos terminados a partir de sus componentes, descontando de bodega principal."
            />

            <div className="mt-8">
                <AssemblyToolbar onNewAssembly={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los ensamblajes.</p>}
                {!isLoading && !isError && (
                    assemblies.length === 0
                        ? <AssembliesEmptyState />
                        : (
                            <AssembliesTable
                                assemblies={assemblies}
                                onView={(assembly) => setAssemblyToView(assembly)}
                                onEdit={(assembly) => {
                                    setSelectedAssembly(assembly);
                                    setOpen(true);
                                }}
                                onConfirm={(assembly) => setAssemblyToConfirm(assembly)}
                                onDelete={(assembly) => setAssemblyToDelete(assembly)}
                            />
                        )
                )}
            </div>

            <AssemblyModal
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

            <AssemblyViewModal
                open={!!assemblyToView}
                assembly={assemblyToView}
                onOpenChange={(value) => {
                    if (!value) {
                        setAssemblyToView(null);
                    }
                }}
            />

            <ConfirmAssemblyDialog
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
                            toast.error(getErrorMessage(error, "No se pudo confirmar el ensamblaje."));
                        }
                    });
                }}
            />

            <DeleteAssemblyDialog
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
                            toast.error(getErrorMessage(error, "No se pudo eliminar el ensamblaje."));
                        }
                    });
                }}
            />

        </PageContainer>
    );
}
