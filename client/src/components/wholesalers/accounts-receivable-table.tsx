import { Check, DollarSign, Eye, HandCoins, Pencil } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateOnly } from "@/lib/format-date";
import { AccountReceivableStatusBadge } from "./account-receivable-status-badge";
import type { AccountReceivable } from "@/types";

type Props = {
    accountsReceivable: AccountReceivable[];
    onView: (accountReceivable: AccountReceivable) => void;
    onEdit: (accountReceivable: AccountReceivable) => void;
    onConfirmSale: (accountReceivable: AccountReceivable) => void;
    onMakePayment: (accountReceivable: AccountReceivable) => void;
    onMarkPaid: (accountReceivable: AccountReceivable) => void;
};

export function AccountsReceivableTable({
    accountsReceivable,
    onView,
    onEdit,
    onConfirmSale,
    onMakePayment,
    onMarkPaid
}: Props) {
    return (
        <EntityTable headers={["N° cuenta de cobro", "Venta", "Saldo pendiente", "Estado", "Fecha", "Vence", "Acciones"]}>
            {accountsReceivable.map(item => {

                const isDraft = item.sale.status === "DRAFT";
                const isPendingPayment = item.sale.status === "CONFIRMED" && !item.isPaid;

                return (
                    <tr key={item.id} className="border-b transition hover:bg-muted/40">
                        <td className="px-6 py-4">{item.number}</td>
                        <td className="px-6 py-4">{item.sale.number}</td>
                        <td className="px-6 py-4">{formatCurrency(item.amount, item.currency)}</td>
                        <td className="px-6 py-4">
                            <AccountReceivableStatusBadge accountReceivable={item} />
                        </td>
                        <td className="px-6 py-4">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                            {item.dueDate ? formatDateOnly(item.dueDate) : "-"}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <Eye
                                    size={18}
                                    className="cursor-pointer text-slate-500 hover:text-primary"
                                    onClick={() => onView(item)}
                                />
                                {isDraft && (
                                    <>
                                        <Pencil
                                            size={18}
                                            className="cursor-pointer text-slate-500 hover:text-primary"
                                            onClick={() => onEdit(item)}
                                        />
                                        <Check
                                            size={18}
                                            className="cursor-pointer text-green-600 hover:text-green-700"
                                            onClick={() => onConfirmSale(item)}
                                        />
                                    </>
                                )}
                                {isPendingPayment && (
                                    <>
                                        <HandCoins
                                            size={18}
                                            className="cursor-pointer text-slate-500 hover:text-primary"
                                            onClick={() => onMakePayment(item)}
                                        />
                                        <DollarSign
                                            size={18}
                                            className="cursor-pointer text-green-600 hover:text-green-700"
                                            onClick={() => onMarkPaid(item)}
                                        />
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                );

            })}
        </EntityTable>
    );
}
