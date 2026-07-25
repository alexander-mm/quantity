import { EntityTable } from "@/components/ui";
import type { InventoryStock } from "@/types";

type Props={
    stock:InventoryStock[];
};

export function InventoryStockTable({
    stock
}:Props){

    return(
        <EntityTable
            headers={[
                "Código",
                "Producto",
                "Bodega",
                "Existencia",
                "Stock mínimo",
                "Estado"
            ]}
        >
            {
                stock.map(item=>(
                    <tr
                        key={item.id}
                        className="border-b transition hover:bg-muted/40"
                    >
                        <td className="px-6 py-4">
                            {item.product.internalCode}
                        </td>

                        <td className="px-6 py-4">
                            {item.product.name}
                        </td>

                        <td className="px-6 py-4">
                            {item.store.name}
                        </td>

                        <td className="px-6 py-4">
                            {item.quantity}
                        </td>

                        <td className="px-6 py-4">
                            {item.product.minimumStock}
                        </td>

                        <td className="px-6 py-4">
                            {
                                Number(item.quantity)>=Number(item.product.minimumStock)
                                ?(
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                                        Correcto
                                    </span>
                                )
                                :(
                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                                        Bajo
                                    </span>
                                )
                            }
                        </td>
                        
                    </tr>
                ))
            }
        </EntityTable>
    );
}