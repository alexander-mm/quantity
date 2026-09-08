import { Eye, Pencil } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateOnly } from "@/lib/format-date";
import { getClientLabel } from "@/lib/client-label";
import type { Quote } from "@/types";

type Props = {
    quotes: Quote[];
    onView: (quote: Quote) => void;
    onEdit: (quote: Quote) => void;
};

export function QuotesTable({ quotes, onView, onEdit }: Props) {
    return (
        <EntityTable headers={["Número", "Fecha", "Cliente", "Total", "Estado", "Acciones"]}>
            {quotes.map(quote => (
                <tr key={quote.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4 font-medium">{quote.number}</td>
                    <td className="px-6 py-4">{formatDateOnly(quote.quoteDate)}</td>
                    <td className="px-6 py-4">{getClientLabel(quote.client)}</td>
                    <td className="px-6 py-4">{formatCurrency(quote.total, quote.currency)}</td>
                    <td className="px-6 py-4">
                        {quote.convertedSale
                            ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">Venta {quote.convertedSale.number}</span>
                            : <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">Pendiente</span>}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Eye size={18} className="cursor-pointer text-slate-500 hover:text-primary" onClick={() => onView(quote)} />
                            {!quote.convertedSale && (
                                <Pencil size={18} className="cursor-pointer text-slate-500 hover:text-primary" onClick={() => onEdit(quote)} />
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
