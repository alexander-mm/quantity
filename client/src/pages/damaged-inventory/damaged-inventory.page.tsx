import { useState } from "react";
import { Eye } from "lucide-react";
import { PageContainer, PageHeader, DamagedStockTable, DamagedPartTable, ResolveReturnModal } from "@/components";
import { EntityTable } from "@/components/ui";
import { RETURN_REASON_LABELS } from "@/components/returns/return-reason-labels";
import { getReturnItemLabel } from "@/components/returns/return-item-label";
import { formatDateOnly } from "@/lib/format-date";
import { useDamagedStock, useDamagedParts, useReturns } from "@/hooks";
import type { Return } from "@/types";
import { LoadingState } from "@/components/ui/spinner";

export function DamagedInventoryPage() {

    const { data: damagedStockData, isLoading: isLoadingStock, isError: isErrorStock } = useDamagedStock();
    const { data: damagedPartsData, isLoading: isLoadingParts, isError: isErrorParts } = useDamagedParts();
    const { data: returnsData, isLoading: isLoadingReturns, isError: isErrorReturns } = useReturns();

    const damagedStock = damagedStockData?.data ?? [];
    const damagedParts = damagedPartsData?.data ?? [];
    const pendingReturns = (returnsData?.data ?? []).filter(item => item.status === "PENDING_REVIEW");

    const [itemToResolve, setItemToResolve] = useState<Return | null>(null);

    return (
        <PageContainer>

            <PageHeader
                title="Inventario Dañado"
                description="Existencias marcadas como dañadas y devoluciones pendientes de revisión."
            />

            <div className="mt-8">
                <h2 className="mb-3 text-lg font-medium">Stock dañado</h2>
                {isLoadingStock && <LoadingState />}
                {isErrorStock && <p className="text-red-500">Error al cargar el inventario dañado.</p>}
                {!isLoadingStock && !isErrorStock && (
                    damagedStock.length === 0
                        ? <p className="text-muted-foreground">No hay existencias dañadas registradas.</p>
                        : <DamagedStockTable stock={damagedStock} />
                )}
            </div>

            <div className="mt-10">
                <h2 className="mb-3 text-lg font-medium">Piezas dañadas</h2>
                {isLoadingParts && <LoadingState />}
                {isErrorParts && <p className="text-red-500">Error al cargar las piezas dañadas.</p>}
                {!isLoadingParts && !isErrorParts && (
                    damagedParts.length === 0
                        ? <p className="text-muted-foreground">No hay piezas dañadas registradas.</p>
                        : <DamagedPartTable parts={damagedParts} />
                )}
            </div>

            <div className="mt-10">
                <h2 className="mb-3 text-lg font-medium">
                    Pendientes de revisión {pendingReturns.length > 0 ? `(${pendingReturns.length})` : ""}
                </h2>
                {isLoadingReturns && <LoadingState />}
                {isErrorReturns && <p className="text-red-500">Error al cargar las devoluciones.</p>}
                {!isLoadingReturns && !isErrorReturns && (
                    pendingReturns.length === 0
                        ? <p className="text-muted-foreground">No hay devoluciones pendientes de revisión.</p>
                        : (
                            <EntityTable headers={["Número", "Fecha", "Ítem", "Cantidad", "Motivo", "Acciones"]}>
                                {pendingReturns.map(item => (
                                    <tr key={item.id} className="border-b transition hover:bg-muted/40">
                                        <td className="px-6 py-4 font-medium">{item.number}</td>
                                        <td className="px-6 py-4">{formatDateOnly(item.returnDate)}</td>
                                        <td className="px-6 py-4">{getReturnItemLabel(item)}</td>
                                        <td className="px-6 py-4">{Number(item.quantity)}</td>
                                        <td className="px-6 py-4">{RETURN_REASON_LABELS[item.reason]}</td>
                                        <td className="px-6 py-4">
                                            <Eye
                                                size={18}
                                                className="cursor-pointer text-slate-500 hover:text-primary"
                                                onClick={() => setItemToResolve(item)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </EntityTable>
                        )
                )}
            </div>

            <ResolveReturnModal
                open={!!itemToResolve}
                item={itemToResolve}
                onOpenChange={(value) => {
                    if (!value) setItemToResolve(null);
                }}
            />

        </PageContainer>
    );
}
