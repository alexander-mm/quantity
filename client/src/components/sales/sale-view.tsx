import type { Sale } from "@/types";
import { Button } from "@/components/ui/button";
import { SaleStatusBadge } from "./sale-status-badge";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateOnly } from "@/lib/format-date";

type Props = {
    sale: Sale;
    onClose: () => void;
};

function getClientLabel(client: Sale["client"]) {
    return client.companyName
        ?? ([client.firstName, client.lastName].filter(Boolean).join(" ")
            || client.document);
}

function getPaymentMethodLabel(paymentMethod: Sale["paymentMethod"]) {
    switch (paymentMethod) {
        case "CASH": return "Efectivo";
        case "TRANSFER": return "Transferencia";
        case "CREDIT": return "Crédito";
        default: return paymentMethod;
    }
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
                        Moneda
                    </p>
                    <p>
                        {sale.currency === "COP" ? "Pesos colombianos (COP)" : "Dólares (USD)"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Fecha
                    </p>
                    <p>
                        {formatDateOnly(sale.saleDate)}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Forma de pago
                    </p>
                    <p>
                        {getPaymentMethodLabel(sale.paymentMethod)}
                        {sale.paymentMethod === "TRANSFER" && sale.transferVouchers.length > 0
                            ? ` (comprobante${sale.transferVouchers.length > 1 ? "s" : ""}: ${sale.transferVouchers.map(v => v.number).join(", ")})`
                            : ""}
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
                                    {formatCurrency(detail.unitPrice, sale.currency)}
                                </td>
                                <td className="p-2 text-center">
                                    {formatCurrency(detail.discount, sale.currency)}
                                </td>
                                <td className="p-2 text-center">
                                    {formatCurrency(detail.tax, sale.currency)}
                                </td>
                                <td className="p-2 text-center">
                                    {formatCurrency(detail.lineTotal, sale.currency)}
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
                        {formatCurrency(sale.subtotal, sale.currency)}
                    </strong>
                </div>

                <div className="flex justify-between">
                    <span>
                        Descuento
                    </span>
                    <strong>
                        {formatCurrency(sale.discount, sale.currency)}
                    </strong>
                </div>

                <div className="flex justify-between">
                    <span>
                        IVA
                    </span>

                    <strong>
                        {formatCurrency(sale.tax, sale.currency)}
                    </strong>
                </div>

                {sale.hasShipping && (
                    <div className="flex justify-between">
                        <span>
                            Costo de envío
                        </span>

                        <strong>
                            {formatCurrency(sale.shippingCost, sale.currency)}
                        </strong>
                    </div>
                )}

                <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                    <span>
                        Total
                    </span>

                    <span>
                        {formatCurrency(sale.total, sale.currency)}
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
