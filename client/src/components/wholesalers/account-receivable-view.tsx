import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format-currency";
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
                    <p className="text-sm text-muted-foreground">Monto</p>
                    <p className="font-medium">{formatCurrency(accountReceivable.amount, accountReceivable.currency)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Fecha de venta</p>
                    <p>{new Date(accountReceivable.sale.saleDate).toLocaleDateString()}</p>
                </div>
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

            <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cerrar
                </Button>
            </div>
        </div>
    );
}
