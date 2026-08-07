import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { StockTransferDetailRow } from "./stock-transfer-detail-row";

export function StockTransferDetailsTable() {

    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: "details" });

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                    <thead className="bg-muted/40">
                        <tr>
                            <th className="p-3 text-left">Producto</th>
                            <th className="p-3 text-left">Cantidad</th>
                            <th className="w-16" />
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((field, index) => (
                            <StockTransferDetailRow key={field.id} index={index} onRemove={() => remove(index)} />
                        ))}
                    </tbody>
                </table>
            </div>

            <Button type="button" variant="outline" onClick={() => append({ productId: "", quantitySent: undefined })}>
                <Plus size={18} />
                Agregar producto
            </Button>
        </div>
    );
}
