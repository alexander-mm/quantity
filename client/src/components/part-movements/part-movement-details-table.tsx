import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PartMovementDetailRow } from "./part-movement-detail-row";

export function PartMovementDetailsTable() {

    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: "details" });

    return (
        <div className="space-y-4">

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <PartMovementDetailRow
                        key={field.id}
                        index={index}
                        onRemove={() => remove(index)}
                    />
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={() => append({ partId: "", quantity: 1 })}
            >
                <Plus size={18} />
                Agregar pieza
            </Button>

        </div>
    );

}
