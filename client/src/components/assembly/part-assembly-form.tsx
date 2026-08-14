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
import { partAssemblySchema } from "@/validators";
import type { PartAssemblyFormData } from "@/validators";
import {
    useParts,
    usePartIdsWithRecipe,
    usePartAssemblyPreview,
    usePartAssembly,
    useCreatePartAssembly,
    useUpdatePartAssembly
} from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    assemblyId?: string;
};

export function PartAssemblyForm({ onSuccess, mode = "create", assemblyId }: Props) {

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<PartAssemblyFormData>({
        resolver: zodResolver(partAssemblySchema),
        defaultValues: {
            number: "",
            partId: "",
            quantity: undefined,
            observations: ""
        }
    });

    const partId = useWatch({ control, name: "partId" });
    const quantity = useWatch({ control, name: "quantity" });

    const { data: partsData } = useParts();
    const { data: recipeIdsData } = usePartIdsWithRecipe();
    const { data: previewData, isFetching: isPreviewLoading } = usePartAssemblyPreview(
        partId || undefined,
        Number(quantity) || undefined
    );
    const { data: assemblyData } = usePartAssembly(
        mode === "edit" ? assemblyId : undefined
    );

    const parts = partsData?.data ?? [];
    const recipeIds = new Set(recipeIdsData?.data ?? []);
    const assemblableParts = parts.filter(part => recipeIds.has(part.id));
    const preview = previewData?.data;

    const createMutation = useCreatePartAssembly();
    const updateMutation = useUpdatePartAssembly();
    const loading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {

        if (mode !== "edit" || !assemblyData?.data) {
            return;
        }

        reset({
            number: assemblyData.data.number,
            partId: assemblyData.data.partId,
            quantity: Number(assemblyData.data.quantity),
            observations: assemblyData.data.observations ?? ""
        });

    }, [mode, assemblyData, reset]);

    const onSubmit = (data: PartAssemblyFormData) => {

        if (preview && !preview.canAssemble) {
            toast.error("No hay stock suficiente para ensamblar esta cantidad. Ajusta la cantidad o espera a que llegue el stock.");
            return;
        }

        const payload = {
            ...data,
            quantity: Number(data.quantity),
            observations: data.observations || undefined
        };

        const onError = (error: unknown) => {
            const message =
                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                    ? error.response.data.message
                    : "No se pudo guardar el ensamblaje.";
            toast.error(message);
        };

        if (mode === "edit" && assemblyId) {
            updateMutation.mutate({ id: assemblyId, data: payload }, {
                onSuccess: () => {
                    toast.success("Ensamblaje actualizado correctamente.");
                    onSuccess?.();
                },
                onError
            });
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Ensamblaje guardado como borrador.");
                reset();
                onSuccess?.();
            },
            onError
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6 min-w-0">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                    <Label className="mb-1">Número</Label>
                    <Input {...register("number")} />
                    <p className="text-sm text-red-500">{errors.number?.message}</p>
                </div>

                <div>
                    <Label className="mb-1">Cantidad a producir</Label>
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

                <div className="md:col-span-2">
                    <Label className="mb-1">Pieza a ensamblar</Label>
                    <Controller
                        control={control}
                        name="partId"
                        render={({ field }) => {

                            const items = assemblableParts.map(part => ({
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
                                        Ninguna pieza tiene una receta de piezas o productos definida.
                                    </ComboboxEmpty>
                                </Combobox>
                            );

                        }}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                        Solo aparecen piezas con receta definida (se define en el formulario de Piezas).
                    </p>
                    <p className="text-sm text-red-500">{errors.partId?.message}</p>
                </div>

                <div className="md:col-span-2">
                    <Label className="mb-1">Observaciones (opcional)</Label>
                    <Input {...register("observations")} />
                </div>

            </div>

            {partId && Number(quantity) > 0 && (

                <div className="space-y-4 rounded-lg border p-3">

                    {isPreviewLoading && <p className="text-sm text-muted-foreground">Calculando...</p>}

                    {preview && (
                        <>
                            {preview.components.length > 0 && (
                                <div>
                                    <p className="mb-2 font-medium">Piezas requeridas (inventario de piezas)</p>
                                    <div className="space-y-2">
                                        {preview.components.map(item => (
                                            <div
                                                key={item.componentPartId}
                                                className="flex items-center justify-between border-b pb-2 text-sm last:border-b-0"
                                            >
                                                <span>{item.componentCode} - {item.componentName}</span>
                                                <span className={item.sufficient ? "text-muted-foreground" : "font-medium text-red-500"}>
                                                    {item.requiredQuantity} requerido / {item.available} disponible
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {preview.products.length > 0 && (
                                <div>
                                    <p className="mb-2 font-medium">Productos requeridos (bodega principal)</p>
                                    <div className="space-y-2">
                                        {preview.products.map(item => (
                                            <div
                                                key={item.componentProductId}
                                                className="flex items-center justify-between border-b pb-2 text-sm last:border-b-0"
                                            >
                                                <span>{item.componentCode} - {item.componentName}</span>
                                                <span className={item.sufficient ? "text-muted-foreground" : "font-medium text-red-500"}>
                                                    {item.requiredQuantity} requerido / {item.available} disponible
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!preview.canAssemble && (
                                <p className="pt-2 text-sm text-red-500">
                                    No hay stock suficiente para ensamblar esta cantidad — ajusta la cantidad o
                                    espera a que llegue el stock antes de guardar.
                                </p>
                            )}
                        </>
                    )}

                </div>

            )}

            <div className="flex justify-end">
                <Button type="submit" disabled={loading || (preview ? !preview.canAssemble : false)}>
                    {loading
                        ? "Guardando..."
                        : mode === "edit" ? "Guardar cambios" : "Guardar borrador"}
                </Button>
            </div>

        </form>
    );

}