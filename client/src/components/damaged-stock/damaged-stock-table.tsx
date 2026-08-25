import { EntityTable } from "@/components/ui";
import type { DamagedStock } from "@/types";

type Props = {
    stock: DamagedStock[];
};

export function DamagedStockTable({ stock }: Props) {
    return (
        <EntityTable headers={["Código", "Producto", "Tienda", "Cantidad dañada"]}>
            {stock.map(item => (
                <tr key={item.id} className="border-b transition hover:bg-muted/40">
                    <td className="px-6 py-4">{item.product.internalCode}</td>
                    <td className="px-6 py-4">{item.product.name}</td>
                    <td className="px-6 py-4">{item.store.name}</td>
                    <td className="px-6 py-4 font-medium text-red-600">{Number(item.quantity)}</td>
                </tr>
            ))}
        </EntityTable>
    );
}
