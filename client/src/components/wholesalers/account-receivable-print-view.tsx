import { DocumentLetterhead, DocumentFooter, PrintPage } from "@/components/print";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateOnly } from "@/lib/format-date";
import { getClientLabel } from "@/lib/client-label";
import type { AccountReceivable } from "@/types";

type Props = {
    accountReceivable: AccountReceivable;
};

export function AccountReceivablePrintView({ accountReceivable }: Props) {
    return (
        <PrintPage>

            <DocumentLetterhead documentTitle="Cuenta de Cobro" documentNumber={accountReceivable.number} />

            <div className="mt-10 flex justify-between text-sm">
                <div>
                    <p className="text-xs tracking-wide text-slate-400 uppercase">Cliente</p>
                    <p className="mt-1 font-medium">{getClientLabel(accountReceivable.client)}</p>
                    <p className="text-xs text-slate-500">{accountReceivable.client.document}</p>
                    {accountReceivable.client.address && <p className="text-xs text-slate-500">{accountReceivable.client.address}</p>}
                    {accountReceivable.client.phone && <p className="text-xs text-slate-500">Tel: {accountReceivable.client.phone}</p>}
                </div>
                <div className="text-right">
                    <p className="text-xs tracking-wide text-slate-400 uppercase">Fecha de inicio</p>
                    <p className="mt-1 font-medium">{formatDateOnly(accountReceivable.sale.saleDate)}</p>
                    <p className="mt-3 text-xs tracking-wide text-slate-400 uppercase">Vencimiento</p>
                    <p className="mt-1 font-medium">
                        {accountReceivable.dueDate ? formatDateOnly(accountReceivable.dueDate) : "Sin plazo"}
                    </p>
                </div>
            </div>

            <table className="mt-10 w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-400 uppercase">
                        <th className="pb-2 font-medium">Producto</th>
                        <th className="pb-2 text-right font-medium">Cantidad</th>
                        <th className="pb-2 text-right font-medium">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {accountReceivable.sale.details.map(detail => (
                        <tr key={detail.id} className="border-b border-slate-100">
                            <td className="py-3">{detail.product.name}</td>
                            <td className="py-3 text-right">{Number(detail.quantity)}</td>
                            <td className="py-3 text-right">{formatCurrency(detail.lineTotal, accountReceivable.currency)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="ml-auto mt-6 w-64 text-sm">
                <div className="flex justify-between py-1 text-slate-500">
                    <span>Total de la venta</span>
                    <span>{formatCurrency(accountReceivable.originalAmount, accountReceivable.currency)}</span>
                </div>
                {Number(accountReceivable.downPayment) > 0 && (
                    <div className="flex justify-between py-1 text-slate-500">
                        <span>Abono inicial</span>
                        <span>{formatCurrency(accountReceivable.downPayment, accountReceivable.currency)}</span>
                    </div>
                )}
                <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-lg font-semibold text-[#0170B8]">
                    <span>Saldo pendiente</span>
                    <span>{formatCurrency(accountReceivable.amount, accountReceivable.currency)}</span>
                </div>
            </div>

            {accountReceivable.payments.length > 0 && (
                <div className="mt-10">
                    <p className="mb-3 text-xs tracking-wide text-slate-400 uppercase">Abonos registrados</p>
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-400 uppercase">
                                <th className="pb-2 font-medium">Fecha</th>
                                <th className="pb-2 font-medium">Forma de pago</th>
                                <th className="pb-2 font-medium">Comprobantes</th>
                                <th className="pb-2 text-right font-medium">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accountReceivable.payments.map(payment => (
                                <tr key={payment.id} className="border-b border-slate-100">
                                    <td className="py-3">{formatDateOnly(payment.paymentDate)}</td>
                                    <td className="py-3">
                                        {payment.paymentMethods.map(entry => (
                                            <div key={entry.id}>
                                                {entry.method === "TRANSFER" ? "Transferencia" : "Efectivo"}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-3">
                                        {payment.vouchers.length > 0 ? payment.vouchers.map(v => v.number).join(", ") : "-"}
                                    </td>
                                    <td className="py-3 text-right">{formatCurrency(payment.amount, accountReceivable.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {accountReceivable.observations && (
                <div className="mt-8 text-sm">
                    <p className="text-xs tracking-wide text-slate-400 uppercase">Observaciones</p>
                    <p className="mt-1 text-slate-600">{accountReceivable.observations}</p>
                </div>
            )}

            <DocumentFooter />

        </PrintPage>
    );
}
