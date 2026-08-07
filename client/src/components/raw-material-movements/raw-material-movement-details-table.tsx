import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RawMaterialMovementDetailRow } from "./raw-material-movement-detail-row";

export function RawMaterialMovementDetailsTable() {

    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: "details" });

    return (
        <div className="space-y-4">

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <RawMaterialMovementDetailRow
                        key={field.id}
                        index={index}
                        onRemove={() => remove(index)}
                    />
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={() => append({ rawMaterialId: "", quantity: undefined })}
            >
                <Plus size={18} />
                Agregar materia prima
            </Button>

        </div>
    );

}
