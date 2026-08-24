import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateOnly } from "@/lib/format-date";
import { AccountReceivableStatusBadge } from "./account-receivable-status-badge";
import type { AccountReceivable } from "@/types";

type Props = {
    accountReceivable: AccountReceivable;
    onClose: () => void;
};

export function AccountReceivableView({ accountReceivable, onClose }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">N° cuenta de cobro</p>
                    <p className="font-medium">{accountReceivable.number}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <AccountReceivableStatusBadge accountReceivable={accountReceivable} />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Venta</p>
                    <p>{accountReceivable.sale.number}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Bodega</p>
                    <p>{accountReceivable.sale.store.name}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Total de la venta</p>
                    <p>{formatCurrency(accountReceivable.originalAmount, accountReceivable.currency)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Saldo pendiente</p>
                    <p className="font-medium">{formatCurrency(accountReceivable.amount, accountReceivable.currency)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Fecha de venta</p>
                    <p>{formatDateOnly(accountReceivable.sale.saleDate)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Plazo</p>
                    <p>
                        {accountReceivable.termDays
                            ? `${accountReceivable.termDays} días${accountReceivable.dueDate ? ` (vence ${formatDateOnly(accountReceivable.dueDate)})` : ""}`
                            : "Sin plazo"}
                    </p>
                </div>
                {Number(accountReceivable.downPayment) > 0 && (
                    <div>
                        <p className="text-sm text-muted-foreground">Abono</p>
                        <p>
                            {formatCurrency(accountReceivable.downPayment, accountReceivable.currency)}
                            {accountReceivable.downPaymentMethod === "TRANSFER" ? " (transferencia" : " (efectivo"}
                            {accountReceivable.downPaymentMethod === "TRANSFER" && accountReceivable.downPaymentVouchers.length > 0
                                ? `: ${accountReceivable.downPaymentVouchers.map(v => v.number).join(", ")}`
                                : ""}
                            )
                        </p>
                    </div>
                )}
                {accountReceivable.paidAt && (
                    <div>
                        <p className="text-sm text-muted-foreground">Fecha de pago</p>
                        <p>{new Date(accountReceivable.paidAt).toLocaleDateString()}</p>
                    </div>
                )}
                <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Observaciones</p>
                    <p>{accountReceivable.observations ?? "-"}</p>
                </div>
            </div>

            <table className="w-full border rounded-lg">
                <thead>
                    <tr className="border-b bg-muted">
                        <th className="p-2 text-left">Producto</th>
                        <th className="p-2">Cantidad</th>
                        <th className="p-2">Total línea</th>
                    </tr>
                </thead>
                <tbody>
                    {accountReceivable.sale.details.map(detail => (
                        <tr key={detail.id} className="border-b">
                            <td className="p-2">{detail.product.name}</td>
                            <td className="p-2 text-center">{Number(detail.quantity)}</td>
                            <td className="p-2 text-center">
                                {formatCurrency(detail.lineTotal, accountReceivable.currency)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {accountReceivable.payments.length > 0 && (
                <div>
                    <p className="mb-2 text-sm text-muted-foreground">Abonos registrados</p>
                    <table className="w-full border rounded-lg">
                        <thead>
                            <tr className="border-b bg-muted">
                                <th className="p-2 text-left">Fecha</th>
                                <th className="p-2 text-left">Forma de pago</th>
                                <th className="p-2 text-left">Comprobantes</th>
                                <th className="p-2 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accountReceivable.payments.map(payment => (
                                <tr key={payment.id} className="border-b">
                                    <td className="p-2">{formatDateOnly(payment.paymentDate)}</td>
                                    <td className="p-2">
                                        {payment.paymentMethod === "TRANSFER" ? "Transferencia" : "Efectivo"}
                                    </td>
                                    <td className="p-2">
                                        {payment.vouchers.length > 0
                                            ? payment.vouchers.map(v => v.number).join(", ")
                                            : "-"}
                                    </td>
                                    <td className="p-2 text-right">
                                        {formatCurrency(payment.amount, accountReceivable.currency)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cerrar
                </Button>
            </div>
        </div>
    );
}
