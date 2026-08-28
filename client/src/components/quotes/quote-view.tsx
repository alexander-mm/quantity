import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Printer, ArrowRightLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintArea, usePrintDocument } from "@/components/print";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateOnly } from "@/lib/format-date";
import { getClientLabel } from "@/lib/client-label";
import { useDeleteQuote } from "@/hooks";
import { QuotePrintView } from "./quote-print-view";
import type { Quote } from "@/types";

type Props = {
    quote: Quote;
    onClose: () => void;
};

export function QuoteView({ quote, onClose }: Props) {

    const navigate = useNavigate();
    const deleteMutation = useDeleteQuote();
    const { print } = usePrintDocument();

    const handleConvert = () => {
        navigate("/sales", {
            state: {
                prefillFromQuote: {
                    quoteId: quote.id,
                    clientId: quote.client.id,
                    currency: quote.currency,
                    details: quote.details.map(d => ({
                        productId: d.product.id,
                        quantity: Number(d.quantity),
                        unitPrice: Number(d.unitPrice),
                        discount: Number(d.discount),
                        tax: Number(d.tax)
                    }))
                }
            }
        });
    };

    const handleDelete = () => {
        if (!window.confirm(`¿Eliminar la cotización ${quote.number}?`)) {
            return;
        }
        deleteMutation.mutate(quote.id, {
            onSuccess: () => {
                toast.success("Cotización eliminada.");
                onClose();
            },
            onError: () => toast.error("No se pudo eliminar la cotización.")
        });
    };

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-muted-foreground">N° cotización</p>
                    <p className="font-medium">{quote.number}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p>{quote.convertedSale ? `Convertida a venta ${quote.convertedSale.number}` : "Pendiente"}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p>{getClientLabel(quote.client)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p>{formatDateOnly(quote.quoteDate)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Válida hasta</p>
                    <p>{quote.validUntil ? formatDateOnly(quote.validUntil) : "Sin vencimiento"}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">{formatCurrency(quote.total, quote.currency)}</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted">
                            <th className="p-2 text-left">Producto</th>
                            <th className="p-2">Cantidad</th>
                            <th className="p-2">Precio unit.</th>
                            <th className="p-2">Total línea</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quote.details.map(detail => (
                            <tr key={detail.id} className="border-b">
                                <td className="p-2 whitespace-nowrap">{detail.product.internalCode} - {detail.product.name}</td>
                                <td className="p-2 text-center">{Number(detail.quantity)}</td>
                                <td className="p-2 text-center whitespace-nowrap">{formatCurrency(detail.unitPrice, quote.currency)}</td>
                                <td className="p-2 text-center whitespace-nowrap">{formatCurrency(detail.lineTotal, quote.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap justify-between gap-2">

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => print("quote-print-area")}>
                        <Printer size={18} />
                        Imprimir
                    </Button>
                    {!quote.convertedSale && (
                        <Button type="button" variant="outline" onClick={handleConvert}>
                            <ArrowRightLeft size={18} />
                            Convertir a venta
                        </Button>
                    )}
                    <Button type="button" variant="outline" onClick={handleDelete} disabled={deleteMutation.isPending}>
                        <Trash2 size={18} className="text-red-500" />
                        Eliminar
                    </Button>
                </div>

                <Button type="button" variant="outline" onClick={onClose}>
                    Cerrar
                </Button>

            </div>

            <PrintArea id="quote-print-area">
                <QuotePrintView quote={quote} />
            </PrintArea>

        </div>
    );
}
