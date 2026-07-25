import type { Purchase } from "@/types";
import { Button } from "@/components/ui/button";
import { PurchaseStatusBadge } from "./purchase-status-badge";

type Props = {
    purchase: Purchase;
    onClose: () => void;
};

export function PurchaseView({
    purchase,
    onClose
}: Props) {

    return (

        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Número
                    </p>
                    <p className="font-medium">
                        {purchase.number}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Estado
                    </p>
                    <PurchaseStatusBadge
                        status={purchase.status}
                    />
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Proveedor
                    </p>
                    <p>
                        {purchase.supplier.companyName}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Bodega
                    </p>
                    <p>
                        {purchase.store.name}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Fecha
                    </p>
                    <p>
                        {new Date(
                            purchase.purchaseDate
                        ).toLocaleDateString()}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Referencia
                    </p>
                    <p>
                        {purchase.reference ?? "-"}
                    </p>
                </div>
                <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">
                        Observaciones
                    </p>
                    <p>
                        {purchase.observations ?? "-"}
                    </p>
                </div>
            </div>

            <table className="w-full border rounded-lg">
                <thead>
                    <tr className="border-b bg-muted">
                        <th className="p-2 text-left">
                            Producto
                        </th>
                        <th className="p-2">
                            Cantidad
                        </th>
                        <th className="p-2">
                            Costo
                        </th>
                        <th className="p-2">
                            Desc.
                        </th>
                        <th className="p-2">
                            IVA
                        </th>
                        <th className="p-2">
                            Total
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {
                        purchase.details.map(detail => (
                            <tr
                                key={detail.id}
                                className="border-b"
                            >
                                <td className="p-2">
                                    {detail.product.name}
                                </td>
                                <td className="p-2 text-center">
                                    {detail.quantity}
                                </td>
                                <td className="p-2 text-center">
                                    ${Number(detail.unitCost).toFixed(2)}
                                </td>
                                <td className="p-2 text-center">
                                    ${Number(detail.discount).toFixed(2)}
                                </td>
                                <td className="p-2 text-center">
                                    ${Number(detail.tax).toFixed(2)}
                                </td>
                                <td className="p-2 text-center">
                                    ${Number(detail.lineTotal).toFixed(2)}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <div className="ml-auto w-80 space-y-2">
                <div className="flex justify-between">
                    <span>
                        Subtotal
                    </span>
                    <strong>
                        ${Number(
                            purchase.subtotal
                        ).toFixed(2)}
                    </strong>
                </div>

                <div className="flex justify-between">
                    <span>
                        Descuento
                    </span>
                    <strong>
                        ${Number(
                            purchase.discount
                        ).toFixed(2)}
                    </strong>
                </div>

                <div className="flex justify-between">
                    <span>
                        IVA
                    </span>

                    <strong>
                        ${Number(
                            purchase.tax
                        ).toFixed(2)}
                    </strong>
                </div>

                <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                    <span>
                        Total
                    </span>

                    <span>
                        ${Number(
                            purchase.total
                        ).toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-end">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >

                        Cerrar

                    </Button>

                </div>

            </div>
        </div>
    );
}