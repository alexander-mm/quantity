import { DocumentLetterhead, DocumentFooter, PrintPage } from "@/components/print";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateOnly } from "@/lib/format-date";
import { getClientLabel } from "@/lib/client-label";
import type { Quote } from "@/types";

type Props = {
    quote: Quote;
};

export function QuotePrintView({ quote }: Props) {
    return (
        <PrintPage>

            <DocumentLetterhead documentTitle="Cotización" documentNumber={quote.number} />

            <div className="mt-10 flex justify-between text-sm">
                <div>
                    <p className="text-xs tracking-wide text-slate-400 uppercase">Cliente</p>
                    <p className="mt-1 font-medium">{getClientLabel(quote.client)}</p>
                    <p className="text-xs text-slate-500">{quote.client.document}</p>
                    {quote.client.address && <p className="text-xs text-slate-500">{quote.client.address}</p>}
                    {quote.client.phone && <p className="text-xs text-slate-500">Tel: {quote.client.phone}</p>}
                </div>
                <div className="text-right">
                    <p className="text-xs tracking-wide text-slate-400 uppercase">Fecha</p>
                    <p className="mt-1 font-medium">{formatDateOnly(quote.quoteDate)}</p>
                    {quote.validUntil && (
                        <>
                            <p className="mt-3 text-xs tracking-wide text-slate-400 uppercase">Válida hasta</p>
                            <p className="mt-1 font-medium">{formatDateOnly(quote.validUntil)}</p>
                        </>
                    )}
                </div>
            </div>

            <table className="mt-10 w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-slate-200 text-left text-xs tracking-wide text-slate-400 uppercase">
                        <th className="pb-2 font-medium">Producto</th>
                        <th className="pb-2 text-right font-medium">Cantidad</th>
                        <th className="pb-2 text-right font-medium">Precio unit.</th>
                        <th className="pb-2 text-right font-medium">Descuento</th>
                        <th className="pb-2 text-right font-medium">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {quote.details.map(detail => (
                        <tr key={detail.id} className="border-b border-slate-100">
                            <td className="py-3">{detail.product.internalCode} - {detail.product.name}</td>
                            <td className="py-3 text-right">{Number(detail.quantity)}</td>
                            <td className="py-3 text-right">{formatCurrency(detail.unitPrice, quote.currency)}</td>
                            <td className="py-3 text-right">{formatCurrency(detail.discount, quote.currency)}</td>
                            <td className="py-3 text-right">{formatCurrency(detail.lineTotal, quote.currency)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="ml-auto mt-6 w-64 text-sm">
                <div className="flex justify-between py-1 text-slate-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(quote.subtotal, quote.currency)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-500">
                    <span>Descuento</span>
                    <span>{formatCurrency(quote.discount, quote.currency)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-500">
                    <span>IVA</span>
                    <span>{formatCurrency(quote.tax, quote.currency)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-lg font-semibold text-[#0170B8]">
                    <span>Total</span>
                    <span>{formatCurrency(quote.total, quote.currency)}</span>
                </div>
            </div>

            {quote.observations && (
                <div className="mt-8 text-sm">
                    <p className="text-xs tracking-wide text-slate-400 uppercase">Observaciones</p>
                    <p className="mt-1 text-slate-600">{quote.observations}</p>
                </div>
            )}

            <DocumentFooter />

        </PrintPage>
    );
}
