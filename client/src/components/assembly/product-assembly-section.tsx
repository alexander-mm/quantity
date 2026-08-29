import { useState } from "react";
import { LoadingState } from "@/components/ui/spinner";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
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
    useDeleteProductAssembly,
    usePagination
} from "@/hooks";
import { PaginationControls } from "@/components/ui";
import type { ProductAssembly } from "@/types";

export function ProductAssemblySection() {

    const { data, isLoading, isError } = useProductAssemblies();
    const assemblies = data?.data ?? [];
    const { pageItems: pagedAssemblies, page, setPage, totalPages, totalItems, pageSize } = usePagination(assemblies);

    const [open, setOpen] = useState(false);
    const [selectedAssembly, setSelectedAssembly] = useState<ProductAssembly | null>(null);
    const [assemblyToView, setAssemblyToView] = useState<ProductAssembly | null>(null);
    const [assemblyToConfirm, setAssemblyToConfirm] = useState<ProductAssembly | null>(null);
    const [assemblyToDelete, setAssemblyToDelete] = useState<ProductAssembly | null>(null);

    const confirmMutation = useConfirmProductAssembly();
    const deleteMutation = useDeleteProductAssembly();

    return (
          <>

            <div className="mt-6">
                <AssemblyToolbar onNewAssembly={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar los ensamblajes.</p>}
                {!isLoading && !isError && (
                    assemblies.length === 0
                        ? <AssembliesEmptyState />
                        : (
                            <>
                                <AssembliesTable
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
                            const message =
                                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                                    ? error.response.data.message
                                    : "No se pudo confirmar el ensamblaje.";
                            toast.error(message);
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