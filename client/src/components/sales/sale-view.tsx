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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">
                        Observaciones
                    </p>
                    <p>
                        {sale.observations ?? "-"}
                    </p>
                </div>
            </div>

            {/* Tabla: solo desde md en adelante, donde 6 columnas entran sin apretar. */}
            <div className="hidden overflow-x-auto rounded-lg border md:block">
                <table className="w-full">
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
                                    <td className="p-2 text-center whitespace-nowrap">
                                        {formatCurrency(detail.unitPrice, sale.currency)}
                                    </td>
                                    <td className="p-2 text-center whitespace-nowrap">
                                        {formatCurrency(detail.discount, sale.currency)}
                                    </td>
                                    <td className="p-2 text-center whitespace-nowrap">
                                        {formatCurrency(detail.tax, sale.currency)}
                                    </td>
                                    <td className="p-2 text-center whitespace-nowrap">
                                        {formatCurrency(detail.lineTotal, sale.currency)}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Tarjetas: por debajo de md, en vez de forzar una tabla angosta a scrollear. */}
            <div className="space-y-3 md:hidden">
                {
                    sale.details.map(detail => (
                        <div
                            key={detail.id}
                            className="rounded-lg border p-3"
                        >
                            <p className="font-medium">
                                {detail.product.name}
                            </p>

                            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <div className="flex justify-between gap-2">
                                    <span className="text-muted-foreground">Cantidad</span>
                                    <span>{detail.quantity}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="text-muted-foreground">Precio</span>
                                    <span>{formatCurrency(detail.unitPrice, sale.currency)}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="text-muted-foreground">Desc.</span>
                                    <span>{formatCurrency(detail.discount, sale.currency)}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="text-muted-foreground">IVA</span>
                                    <span>{formatCurrency(detail.tax, sale.currency)}</span>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
                                <span>Total</span>
                                <span>{formatCurrency(detail.lineTotal, sale.currency)}</span>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="w-full space-y-2 sm:ml-auto sm:w-80">
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

                {sale.hasLabor && (
                    <div className="flex justify-between">
                        <span>
                            Mano de obra
                        </span>

                        <strong>
                            {formatCurrency(sale.laborCost, sale.currency)}
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
