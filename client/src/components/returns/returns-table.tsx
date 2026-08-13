import { Eye } from "lucide-react";
import { EntityTable } from "@/components/ui";
import { ReturnStatusBadge } from "./return-status-badge";
import { RETURN_REASON_LABELS } from "./return-reason-labels";
import type { Return } from "@/types";

type Props = {
    returns: Return[];
    onView: (item: Return) => void;
};

function DispositionCell({ item }: { item: Return }) {

    if (!item.disposition) {
        return <span className="text-muted-foreground">—</span>;
    }

    if (item.disposition === "DAMAGED") {
        return <span className="font-medium text-red-600">Dañado</span>;
    }

    return <span className="font-medium text-green-700">Vuelve a stock</span>;

}

export function ReturnsTable({ returns, onView }: Props) {
    return (
        <EntityTable headers={["Número", "Fecha", "Producto", "Cantidad", "Motivo", "Estado", "Destino", "Acciones"]}>
            {returns.map(item => (
                <tr key={item.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4 font-medium">{item.number}</td>
                    <td className="px-6 py-4">{new Date(item.returnDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{item.product.internalCode} - {item.product.name}</td>
                    <td className="px-6 py-4">{Number(item.quantity)}</td>
                    <td className="px-6 py-4">{RETURN_REASON_LABELS[item.reason]}</td>
                    <td className="px-6 py-4"><ReturnStatusBadge status={item.status} /></td>
                    <td className="px-6 py-4"><DispositionCell item={item} /></td>
                    <td className="px-6 py-4">
                        <Eye size={18} className="cursor-pointer text-slate-500 hover:text-primary" onClick={() => onView(item)} />
                    </td>
                </tr>
            ))}
        </EntityTable>
    );
}
