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
import { partAdjustmentSchema } from "@/validators";
import type { PartAdjustmentFormData } from "@/validators";
import { useParts, usePartAdjustments, useCreatePartAdjustment } from "@/hooks";
import { getNextSequentialCode } from "@/lib";

type Props = {
    onSuccess?: () => void;
};

export function PartAdjustmentForm({ onSuccess }: Props) {

    const { register, control, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<PartAdjustmentFormData>({
        resolver: zodResolver(partAdjustmentSchema),
        defaultValues: {
            number: "",
            partId: "",
            type: "IN",
            quantity: undefined,
            reason: ""
        }
    });

    const { data: partsData } = useParts();
    const { data: adjustmentsData } = usePartAdjustments();
    const parts = partsData?.data ?? [];

    const createMutation = useCreatePartAdjustment();
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

    const onSubmit = (data: PartAdjustmentFormData) => {

        createMutation.mutate({
            number: data.number,
            partId: data.partId,
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
                <Label className="mb-1">Pieza</Label>
                <Controller
                    control={control}
                    name="partId"
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
                                <ComboboxEmpty>No se encontraron piezas.</ComboboxEmpty>
                            </Combobox>
                        );

                    }}
                />
                <p className="text-sm text-red-500">{errors.partId?.message}</p>
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
                    step="1"
                    placeholder="0"
                    {...register("quantity", {
                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                    })}
                />
                <p className="text-sm text-red-500">{errors.quantity?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Motivo</Label>
                <Input placeholder="Ej: pieza dañada, conteo físico..." {...register("reason")} />
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
