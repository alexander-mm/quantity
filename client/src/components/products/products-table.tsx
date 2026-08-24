import { useState } from "react";
import { toast } from "react-hot-toast";
import { Eye, Pencil, Printer, Trash2 } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format-currency";
import type { Product } from "@/types";
import { useAuth, useProductPriceEntryLabels } from "@/hooks";
import { ROLES } from "@/constants/roles";
import { usePrintLabel } from "@/app/providers/print-label-provider";

type Props = {
    products: Product[];
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    stockByProductId?: Record<string, string>;
};

export function ProductsTable({
    products,
    onView,
    onEdit,
    onDelete,
    stockByProductId

}: Props) {
    const { user } = useAuth();
    const isAdmin = user?.roleName === ROLES.ADMIN;
    const showStock = !!stockByProductId;
    const { data: priceEntryLabelsData } = useProductPriceEntryLabels();
    const priceEntryLabels = priceEntryLabelsData?.data ?? [];
    const { printLabel } = usePrintLabel();

    const handlePrintLabel = (product: Product) => {

        if (!product.barcode) {
            toast.error("Este producto no tiene código de barras asignado.");
            return;
        }

        printLabel({
            barcode: product.barcode,
            internalCode: product.internalCode,
            name: product.name
        });

    };
    const [priceEntryKey, setPriceEntryKey] = useState("USD-1");
    const [selectedCurrency, selectedSequenceRaw] = priceEntryKey.split("-");
    const selectedSequence = Number(selectedSequenceRaw);

    return (
        <EntityTable
            headers={[
                "Código",
                "Producto",
                "Marca",
                <Select
                    key="price-entry"
                    value={priceEntryKey}
                    onValueChange={(value) => value && setPriceEntryKey(value)}
                >
                    <SelectTrigger className="h-8 w-28 border-none bg-transparent p-0 text-sm font-semibold shadow-none focus-visible:ring-0">
                        <SelectValue>
                            {(value: string | null) =>
                                priceEntryLabels.find(entry => `${entry.currency}-${entry.sequence}` === value)?.label ?? ""
                            }
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {priceEntryLabels.map(entry => (
                            <SelectItem key={`${entry.currency}-${entry.sequence}`} value={`${entry.currency}-${entry.sequence}`}>
                                {entry.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>,
                ...(showStock ? ["Existencias"] : []),
                "Acciones"
            ]}
        >
            {
                products.map(product => (
                    <tr
                        key={product.id}
                        className="border-b transition hover:bg-muted/40"
                    >
                        <td className="px-6 py-4">
                            {product.internalCode}
                        </td>
                        <td className="px-6 py-4 font-medium">
                            {product.name}
                        </td>
                        <td className="px-6 py-4">
                            {product.brand.name}
                        </td>
                        <td className="px-6 py-4">
                            {
                                (() => {
                                    const entry = product.priceEntries.find(
                                        item => item.currency === selectedCurrency && item.sequence === selectedSequence
                                    );
                                    return entry ? formatCurrency(entry.price, entry.currency) : "-";
                                })()
                            }
                        </td>
                        {showStock && (
                            <td className="px-6 py-4">
                                {stockByProductId?.[product.id] ?? "0"}
                            </td>
                        )}
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <Eye
                                    size={18}
                                    className="cursor-pointer text-slate-500 hover:text-primary"
                                    onClick={() => onView(product)}
                                />
                                <Printer
                                    size={18}
                                    className="cursor-pointer text-slate-500 hover:text-primary"
                                    onClick={() => handlePrintLabel(product)}
                                />
                                {isAdmin && (
                                    <>
                                        <Pencil
                                            size={18}
                                            className="cursor-pointer text-slate-500 hover:text-primary"
                                            onClick={() => onEdit(product)}
                                        />
                                        <Trash2
                                            size={18}
                                            className="cursor-pointer text-red-500 hover:text-red-700"
                                            onClick={() => onDelete(product)}
                                        />
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                ))
            }
        </EntityTable>
    );
}
