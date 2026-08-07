import { Trash2 } from "lucide-react";
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
import { useRawMaterials } from "@/hooks";

type Props = {
    index: number;
    onRemove: () => void;
};

export function RawMaterialMovementDetailRow({ index, onRemove }: Props) {

    const { control, register, watch } = useFormContext();

    const { data: rawMaterialsData } = useRawMaterials();
    const rawMaterials = rawMaterialsData?.data ?? [];

    const type = watch("type");
    const rawMaterialId = watch(`details.${index}.rawMaterialId`);
    const quantity = Number(watch(`details.${index}.quantity`)) || 0;

    const selected = rawMaterials.find(item => item.id === rawMaterialId);
    const available = selected ? Number(selected.quantity) : null;
    const insufficient = type === "OUT" && available !== null && quantity > available;

    return (

        <div className="space-y-3 rounded-lg border p-3">

            <div>
                <Label className="mb-1">Materia prima</Label>
                <Controller
                    control={control}
                    name={`details.${index}.rawMaterialId`}
                    render={({ field }) => {

                        const items = rawMaterials.map(item => ({
                            value: item.id,
                            label: `${item.code} - ${item.name}`
                        }));

                        const selectedItem = items.find(item => item.value === field.value) ?? null;

                        return (
                            <Combobox
                                items={items}
                                value={selectedItem}
                                onValueChange={(item) => field.onChange(item ? item.value : "")}
                            >
                                <ComboboxInput placeholder="Buscar materia prima..." />
                                <ComboboxContent>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item}>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxContent>
                                <ComboboxEmpty>
                                    No se encontraron materias primas.
                                </ComboboxEmpty>
                            </Combobox>
                        );

                    }}
                />
                {selected && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        Stock actual: {Number(selected.quantity)}
                    </p>
                )}
            </div>

            <div>
                <Label className="mb-1">Cantidad</Label>
                <Input
                    type="number"
                    min={0}
                    step="0.01"
                    {...register(`details.${index}.quantity`, { valueAsNumber: true })}
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
