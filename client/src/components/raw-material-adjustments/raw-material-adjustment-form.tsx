import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onFormError } from "@/lib/form-error-toast";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import { rawMaterialAdjustmentSchema } from "@/validators";
import type { RawMaterialAdjustmentFormData } from "@/validators";
import { useRawMaterials, useRawMaterialAdjustments, useCreateRawMaterialAdjustment } from "@/hooks";
import { getNextSequentialCode } from "@/lib";

type Props = {
    onSuccess?: () => void;
};

export function RawMaterialAdjustmentForm({ onSuccess }: Props) {

    const { register, control, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<RawMaterialAdjustmentFormData>({
        resolver: zodResolver(rawMaterialAdjustmentSchema),
        defaultValues: {
            number: "",
            rawMaterialId: "",
            type: "IN",
            quantity: undefined,
            reason: ""
        }
    });

    const { data: rawMaterialsData } = useRawMaterials();
    const { data: adjustmentsData } = useRawMaterialAdjustments();
    const rawMaterials = rawMaterialsData?.data ?? [];

    const createMutation = useCreateRawMaterialAdjustment();
    const loading = createMutation.isPending;

    useEffect(() => {

        if (!adjustmentsData?.data || getValues("number")) {
            return;
        }

        const [lastAdjustment] = [...adjustmentsData.data].sort(
            (a, b) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime()
        );

        const nextNumber = getNextSequentialCode(lastAdjustment?.number);

        if (nextNumber) {
            setValue("number", nextNumber);
        }

    }, [adjustmentsData, getValues, setValue]);

    const onSubmit = (data: RawMaterialAdjustmentFormData) => {

        createMutation.mutate({
            number: data.number,
            rawMaterialId: data.rawMaterialId,
            type: data.type,
            quantity: Number(data.quantity),
            reason: data.reason
        }, {
            onSuccess: () => {
                toast.success("Ajuste registrado correctamente.");
                reset();
                onSuccess?.();
            },
            onError: () => {
                toast.error("No se pudo registrar el ajuste.");
            }
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)} noValidate className="space-y-5">

            <div>
                <Label className="mb-1">Número</Label>
                <Input {...register("number")} />
                <p className="text-sm text-red-500">{errors.number?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Materia prima</Label>
                <Controller
                    control={control}
                    name="rawMaterialId"
                    render={({ field }) => {

                        const items = rawMaterials.map(item => ({
                            value: item.id,
                            label: `${item.code} - ${item.name}`
                        }));

                        const selected = items.find(item => item.value === field.value) ?? null;

                        return (
                            <Combobox
                                items={items}
                                value={selected}
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
                                <ComboboxEmpty>No se encontraron materias primas.</ComboboxEmpty>
                            </Combobox>
                        );

                    }}
                />
                <p className="text-sm text-red-500">{errors.rawMaterialId?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Tipo de ajuste</Label>
                <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IN">Ajuste positivo (sobrante)</SelectItem>
                                <SelectItem value="OUT">Ajuste negativo (faltante / dañado)</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <div>
                <Label className="mb-1">Cantidad</Label>
                <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0"
                    {...register("quantity", {
                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                    })}
                />
                <p className="text-sm text-red-500">{errors.quantity?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Motivo</Label>
                <Input placeholder="Ej: material dañado, conteo físico..." {...register("reason")} />
                <p className="text-sm text-red-500">{errors.reason?.message}</p>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}
