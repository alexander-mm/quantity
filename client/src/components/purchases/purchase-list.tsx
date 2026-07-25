import { Eye, Check, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { PurchaseStatusBadge } from "./purchase-status-badge";
import type { Purchase } from "@/types";
import { useConfirmPurchase, useCancelPurchase } from "@/hooks";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { ConfirmPurchaseDialog } from "./confirm-purchase-dialog";
import { CancelPurchaseDialog } from "./cancel-purchase-dialog";

type Props = {
    purchases: Purchase[];
    onView: (purchase: Purchase) => void;
};

export function PurchasesTable({
    purchases,
    onView
}: Props) {

    const confirmMutation =
        useConfirmPurchase();

    const cancelMutation =
        useCancelPurchase();

    const [

        purchaseToCancel,

        setPurchaseToCancel

    ] = useState<Purchase | null>(null);

    const [
        purchaseToConfirm,
        setPurchaseToConfirm
    ] = useState<Purchase | null>(null);

    return (
        <>
            <EntityTable
                headers={[
                    "Número",
                    "Fecha",
                    "Proveedor",
                    "Bodega",
                    "Estado",
                    "Total",
                    "Acciones"
                ]}
            >
                {
                    purchases.map(purchase => (
                        <tr
                            key={purchase.id}
                            className="border-b transition hover:bg-muted/40"
                        >
                            <td className="px-6 py-4">
                                {purchase.number}
                            </td>
                            <td className="px-6 py-4">
                                {new Date(
                                    purchase.purchaseDate
                                ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                {purchase.supplier.name}
                            </td>
                            <td className="px-6 py-4">
                                {purchase.store.name}
                            </td>
                            <td className="px-6 py-4">
                                <PurchaseStatusBadge
                                    status={purchase.status}
                                />
                            </td>
                            <td className="px-6 py-4">
                                $
                                {Number(
                                    purchase.total
                                ).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Eye
                                        size={18}
                                        className="cursor-pointer text-slate-500 hover:text-primary"
                                        onClick={() =>
                                            onView(purchase)
                                        }
                                    />
                                    {
                                        purchase.status === "DRAFT" && (
                                            <Check
                                                size={18}
                                                className="cursor-pointer text-green-600 hover:text-green-700"
                                                onClick={() => {
                                                    setPurchaseToConfirm(purchase);
                                                }}
                                            />
                                        )
                                    }
                                    {
                                        purchase.status === "DRAFT" && (

                                            <Trash2
                                                size={18}
                                                className="cursor-pointer text-red-600 hover:text-red-700"
                                                onClick={() =>
                                                    setPurchaseToCancel(
                                                        purchase
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

            <ConfirmPurchaseDialog

                open={!!purchaseToConfirm}

                loading={confirmMutation.isPending}

                onOpenChange={() =>
                    setPurchaseToConfirm(null)
                }

                onConfirm={() => {
                    if (!purchaseToConfirm) {
                        return;
                    }

                    confirmMutation.mutate(
                        purchaseToConfirm.id,
                        {
                            onSuccess: () => {
                                toast.success(
                                    "Compra confirmada."
                                );
                                setPurchaseToConfirm(null);
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
            <CancelPurchaseDialog

                open={
                    !!purchaseToCancel
                }

                loading={
                    cancelMutation.isPending
                }

                onOpenChange={() =>
                    setPurchaseToCancel(null)
                }

                onConfirm={() => {

                    if (!purchaseToCancel) {

                        return;

                    }

                    cancelMutation.mutate(

                        purchaseToCancel.id,

                        {

                            onSuccess: () => {

                                toast.success(
                                    "Compra cancelada."
                                );

                                setPurchaseToCancel(null);

                            },

                            onError: () => {

                                toast.error(
                                    "No se pudo cancelar la compra."
                                );

                            }

                        }

                    );

                }}

            />
        </>
    );
}