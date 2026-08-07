import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import { partCuttingOrderSchema } from "@/validators";
import type { PartCuttingOrderFormData } from "@/validators";
import {
    useParts,
    usePartRecipe,
    usePartCuttingOrder,
    useCreatePartCuttingOrder,
    useUpdatePartCuttingOrder
} from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    orderId?: string;
};

export function CuttingOrderForm({ onSuccess, mode = "create", orderId }: Props) {

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<PartCuttingOrderFormData>({
        resolver: zodResolver(partCuttingOrderSchema),
        defaultValues: {
            number: "",
            partId: "",
            rawMaterialQtyUsed: undefined,
            observations: ""
        }
    });

    const partId = useWatch({ control, name: "partId" });
    const rawMaterialQtyUsed = useWatch({ control, name: "rawMaterialQtyUsed" });

    const { data: partsData } = useParts();
    const { data: recipeData } = usePartRecipe(partId || undefined);
    const { data: orderData } = usePartCuttingOrder(mode === "edit" ? orderId : undefined);

    const parts = partsData?.data ?? [];
    const recipe = recipeData?.data;

    const createMutation = useCreatePartCuttingOrder();
    const updateMutation = useUpdatePartCuttingOrder();
    const loading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {

        if (mode !== "edit" || !orderData?.data) {
            return;
        }

        reset({
            number: orderData.data.number,
            partId: orderData.data.partId,
            rawMaterialQtyUsed: Number(orderData.data.rawMaterialQtyUsed),
            observations: orderData.data.observations ?? ""
        });

    }, [mode, orderData, reset]);

    const onSubmit = (data: PartCuttingOrderFormData) => {

        const payload = {
            number: data.number,
            partId: data.partId,
            rawMaterialQtyUsed: Number(data.rawMaterialQtyUsed),
            observations: data.observations || undefined
        };

        const onError = (error: unknown) => {
            const message =
                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                    ? error.response.data.message
                    : "No se pudo guardar la orden de corte.";
            toast.error(message);
        };

        if (mode === "edit" && orderId) {
            updateMutation.mutate({ id: orderId, data: payload }, {
                onSuccess: () => {
                    toast.success("Orden de corte actualizada correctamente.");
                    onSuccess?.();
                },
                onError
            });
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Orden de corte registrada como borrador.");
                reset();
                onSuccess?.();
            },
            onError
        });

    };

    const estimatedPieces = recipe ? Number(recipe.piecesPerUnit) * (Number(rawMaterialQtyUsed) || 0) : null;

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)} noValidate className="space-y-6 min-w-0">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                    <Label>Número</Label>
                    <Input {...register("number")} />
                    <p className="text-sm text-red-500">{errors.number?.message}</p>
                </div>

                <div>
                    <Label>Cantidad de materia prima a usar</Label>
                    <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0"
                        {...register("rawMaterialQtyUsed", {
                            setValueAs: (v) => (v === "" ? undefined : Number(v))
                        })}
                    />
                    <p className="text-sm text-red-500">{errors.rawMaterialQtyUsed?.message}</p>
                </div>

                <div className="md:col-span-2">
                    <Label className="mb-1">Pieza a cortar</Label>
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
                                    <ComboboxEmpty>
                                        No se encontraron piezas.
                                    </ComboboxEmpty>
                                </Combobox>
                            );

                        }}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                        La pieza debe tener una receta de corte definida (sección "Recetas de corte").
                    </p>
                    <p className="text-sm text-red-500">{errors.partId?.message}</p>
                </div>

                <div className="md:col-span-2">
                    <Label>Observaciones (opcional)</Label>
                    <Input {...register("observations")} />
                </div>

            </div>

            {partId && (
                <div className="rounded-lg border p-3 text-sm">
                    {!recipe && (
                        <p className="text-amber-600">
                            Esta pieza no tiene una receta de corte definida todavía.
                        </p>
                    )}
                    {recipe && (
                        <div className="space-y-1">
                            <p>
                                Materia prima: <strong>{recipe.rawMaterial.code} - {recipe.rawMaterial.name}</strong>
                                {" "}(stock actual: {Number(recipe.rawMaterial.quantity)})
                            </p>
                            <p>
                                Piezas estimadas a producir: <strong>{estimatedPieces}</strong>
                                {" "}({Number(recipe.piecesPerUnit)} por unidad de materia prima)
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading
                        ? "Guardando..."
                        : mode === "edit" ? "Guardar cambios" : "Guardar borrador"}
                </Button>
            </div>

        </form>
    );

}
