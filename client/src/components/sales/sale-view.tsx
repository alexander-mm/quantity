import type { Sale } from "@/types";
import { Button } from "@/components/ui/button";
import { SaleStatusBadge } from "./sale-status-badge";

type Props = {
    sale: Sale;
    onClose: () => void;
};

function getClientLabel(client: Sale["client"]) {
    return client.companyName
        ?? ([client.firstName, client.lastName].filter(Boolean).join(" ")
            || client.document);
}

export function SaleView({
    sale,
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
                        {sale.number}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Estado
                    </p>
                    <SaleStatusBadge
                        status={sale.status}
                    />
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Cliente
                    </p>
                    <p>
                        {getClientLabel(sale.client)}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Bodega
                    </p>
                    <p>
                        {sale.store.name}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Fecha
                    </p>
                    <p>
                        {new Date(
                            sale.saleDate
                        ).toLocaleDateString()}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Referencia
                    </p>
                    <p>
                        {sale.reference ?? "-"}
                    </p>
                </div>
                <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">
                        Observaciones
                    </p>
                    <p>
                        {sale.observations ?? "-"}
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
                            Precio
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
                        sale.details.map(detail => (
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
                                    ${Number(detail.unitPrice).toFixed(2)}
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
                            sale.subtotal
                        ).toFixed(2)}
                    </strong>
                </div>

                <div className="flex justify-between">
                    <span>
                        Descuento
                    </span>
                    <strong>
                        ${Number(
                            sale.discount
                        ).toFixed(2)}
                    </strong>
                </div>

                <div className="flex justify-between">
                    <span>
                        IVA
                    </span>

                    <strong>
                        ${Number(
                            sale.tax
                        ).toFixed(2)}
                    </strong>
                </div>

                <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                    <span>
                        Total
                    </span>

                    <span>
                        ${Number(
                            sale.total
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
