import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Controller, useFormContext } from "react-hook-form";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MinimumStockField } from "@/components/shared";
import { useParts, useUpdatePartMinimumStock } from "@/hooks";

type Props = {
    index: number;
    onRemove: () => void;
};

export function PartMovementDetailRow({ index, onRemove }: Props) {

    const { control, register, watch } = useFormContext();

    const { data: partsData } = useParts();
    const parts = partsData?.data ?? [];
    const updateMinimumStockMutation = useUpdatePartMinimumStock();

    const type = watch("type");
    const partId = watch(`details.${index}.partId`);
    const quantity = Number(watch(`details.${index}.quantity`)) || 0;

    const selectedPart = parts.find(part => part.id === partId);
    const available = selectedPart ? Number(selectedPart.quantity) : null;
    const insufficient = type === "OUT" && available !== null && quantity > available;

    return (

        <div className="space-y-3 rounded-lg border p-3">

            <div>
                <Label className="mb-1">Pieza</Label>
                <Controller
                    control={control}
                    name={`details.${index}.partId`}
                    render={({ field }) => {

                        const items = parts.map(part => ({
                            value: part.id,
                            label: `${part.code} - ${part.name}`
                        }));

                        const selected = items.find(item => item.value === field.value) ?? null;

                        return (
                            <Combobox
                                items={items}
                                value={selected}
                                onValueChange={(item) => field.onChange(item ? item.value : "")}
                            >
                                <ComboboxInput placeholder="Buscar pieza..." />
                                <ComboboxContent>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item}>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxContent>
                                <ComboboxEmpty>
                                    No se encontraron piezas.
                                </ComboboxEmpty>
                            </Combobox>
                        );

                    }}
                />
                {selectedPart && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        Stock actual: {Number(selectedPart.quantity)}
                    </p>
                )}
            </div>

            {selectedPart && (
                <MinimumStockField
                    currentValue={Number(selectedPart.minimumStock)}
                    saving={updateMinimumStockMutation.isPending}
                    editElsewhereLabel="Para cambiarlo, edítalo desde la sección Piezas."
                    onSave={(value) => {
                        updateMinimumStockMutation.mutate(
                            { id: selectedPart.id, minimumStock: value },
                            {
                                onSuccess: () => toast.success("Stock mínimo actualizado."),
                                onError: () => toast.error("No se pudo actualizar el stock mínimo.")
                            }
                        );
                    }}
                />
            )}

            <div>
                <Label className="mb-1">Cantidad</Label>
                <Input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="0"
                    {...register(`details.${index}.quantity`, {
                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                    })}
                />
                {insufficient && (
                    <p className="mt-1 text-xs text-red-500">
                        Stock insuficiente: disponible {available}.
                    </p>
                )}
            </div>

            <div className="flex items-center justify-end border-t pt-3">
                <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
                    <Trash2 size={18} className="text-red-500" />
                </Button>
            </div>

        </div>

    );

}
