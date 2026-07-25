import { Eye, Check, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { SaleStatusBadge } from "./sale-status-badge";
import type { Sale } from "@/types";
import { useConfirmSale, useCancelSale } from "@/hooks";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { ConfirmSaleDialog } from "./confirm-sale-dialog";
import { CancelSaleDialog } from "./cancel-sale-dialog";

type Props = {
    sales: Sale[];
    onView: (sale: Sale) => void;
};

function getClientLabel(client: Sale["client"]) {
    return client.companyName
        ?? ([client.firstName, client.lastName].filter(Boolean).join(" ")
            || client.document);
}

export function SalesTable({
    sales,
    onView
}: Props) {

    const confirmMutation =
        useConfirmSale();

    const cancelMutation =
        useCancelSale();

    const [

        saleToCancel,

        setSaleToCancel

    ] = useState<Sale | null>(null);

    const [
        saleToConfirm,
        setSaleToConfirm
    ] = useState<Sale | null>(null);

    return (
        <>
            <EntityTable
                headers={[
                    "Número",
                    "Fecha",
                    "Cliente",
                    "Bodega",
                    "Estado",
                    "Total",
                    "Acciones"
                ]}
            >
                {
                    sales.map(sale => (
                        <tr
                            key={sale.id}
                            className="border-b transition hover:bg-muted/40"
                        >
                            <td className="px-6 py-4">
                                {sale.number}
                            </td>
                            <td className="px-6 py-4">
                                {new Date(
                                    sale.saleDate
                                ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                {getClientLabel(sale.client)}
                            </td>
                            <td className="px-6 py-4">
                                {sale.store.name}
                            </td>
                            <td className="px-6 py-4">
                                <SaleStatusBadge
                                    status={sale.status}
                                />
                            </td>
                            <td className="px-6 py-4">
                                $
                                {Number(
                                    sale.total
                                ).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Eye
                                        size={18}
                                        className="cursor-pointer text-slate-500 hover:text-primary"
                                        onClick={() =>
                                            onView(sale)
                                        }
                                    />
                                    {
                                        sale.status === "DRAFT" && (
                                            <Check
                                                size={18}
                                                className="cursor-pointer text-green-600 hover:text-green-700"
                                                onClick={() => {
                                                    setSaleToConfirm(sale);
                                                }}
                                            />
                                        )
                                    }
                                    {
                                        sale.status === "DRAFT" && (

                                            <Trash2
                                                size={18}
                                                className="cursor-pointer text-red-600 hover:text-red-700"
                                                onClick={() =>
                                                    setSaleToCancel(
                                                        sale
                                                    )
                                                }
                                            />

                                        )
                                    }
                                </div>
                            </td>
                        </tr>
                    ))
                }
            </EntityTable>

            <ConfirmSaleDialog

                open={!!saleToConfirm}

                loading={confirmMutation.isPending}

                onOpenChange={() =>
                    setSaleToConfirm(null)
                }

                onConfirm={() => {
                    if (!saleToConfirm) {
                        return;
                    }

                    confirmMutation.mutate(
                        saleToConfirm.id,
                        {
                            onSuccess: () => {
                                toast.success(
                                    "Venta confirmada."
                                );
                                setSaleToConfirm(null);
                            },

                            onError: () => {
                                toast.error(
                                    "No se pudo confirmar."
                                );
                            }
                        }
                    );
                }}
            />
            <CancelSaleDialog

                open={
                    !!saleToCancel
                }

                loading={
                    cancelMutation.isPending
                }

                onOpenChange={() =>
                    setSaleToCancel(null)
                }

                onConfirm={() => {

                    if (!saleToCancel) {

                        return;

                    }

                    cancelMutation.mutate(

                        saleToCancel.id,

                        {

                            onSuccess: () => {

                                toast.success(
                                    "Venta cancelada."
                                );

                                setSaleToCancel(null);

                            },

                            onError: () => {

                                toast.error(
                                    "No se pudo cancelar la venta."
                                );

                            }

                        }

                    );

                }}

            />
        </>
    );
}
