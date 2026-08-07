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
import { useParts } from "@/hooks";

type Props = {
    index: number;
    onRemove: () => void;
};

export function EquipmentPartRow({ index, onRemove }: Props) {

    const { control, register } = useFormContext();

    const { data: partsData } = useParts();
    const parts = partsData?.data ?? [];

    return (

        <div className="grid grid-cols-1 gap-3 rounded-lg border p-3 md:grid-cols-[1fr_120px_auto] md:items-end">

            <div>
                <Label className="mb-1">Pieza</Label>
                <Controller
                    control={control}
                    name={`parts.${index}.partId`}
                    render={({ field }) => {

                        const items = parts.map(part => ({
                            value: part.id,
                            label: `${part.name}`
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
            </div>

            <div>
                <Label className="mb-1">Cantidad</Label>
                <Input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="0"
                    {...register(`parts.${index}.quantity`, {
                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                    })}
                />
            </div>

            <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
                <Trash2 size={18} className="text-red-500" />
            </Button>

        </div>

    );

}
