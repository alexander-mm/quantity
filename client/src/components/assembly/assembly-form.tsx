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
import { productAssemblySchema } from "@/validators";
import type { ProductAssemblyFormData } from "@/validators";
import { getNextSequentialCode } from "@/lib";
import {
    useProducts,
    useProductIdsWithRecipe,
    useProductAssemblyPreview,
    useProductAssembly,
    useProductAssemblies,
    useCreateProductAssembly,
    useUpdateProductAssembly
} from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    assemblyId?: string;
};

export function AssemblyForm({ onSuccess, mode = "create", assemblyId }: Props) {

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<ProductAssemblyFormData>({
        resolver: zodResolver(productAssemblySchema),
        defaultValues: {
            number: "",
            productId: "",
            quantity: undefined,
            observations: ""
        }
    });

    const productId = useWatch({ control, name: "productId" });
    const quantity = useWatch({ control, name: "quantity" });

    const { data: productsData } = useProducts();
    const { data: recipeIdsData } = useProductIdsWithRecipe();
    const { data: previewData, isFetching: isPreviewLoading } = useProductAssemblyPreview(
        productId || undefined,
        Number(quantity) || undefined
    );
    const { data: assemblyData } = useProductAssembly(
        mode === "edit" ? assemblyId : undefined
    );
    const { data: assembliesData } = useProductAssemblies();

    const products = productsData?.data ?? [];
    const recipeIds = new Set(recipeIdsData?.data ?? []);
    const assemblableProducts = products.filter(product => recipeIds.has(product.id));
    const preview = previewData?.data;

    const createMutation = useCreateProductAssembly();
    const updateMutation = useUpdateProductAssembly();
    const loading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {

        if (mode !== "create" || !assembliesData?.data || getValues("number")) {
            return;
        }

        const [lastAssembly] = [...assembliesData.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const nextNumber = getNextSequentialCode(lastAssembly?.number);

        if (nextNumber) {
            setValue("number", nextNumber);
        }

    }, [mode, assembliesData, getValues, setValue]);

    useEffect(() => {

        if (mode !== "edit" || !assemblyData?.data) {
            return;
        }

        reset({
            number: assemblyData.data.number,
            productId: assemblyData.data.productId,
            quantity: Number(assemblyData.data.quantity),
            observations: assemblyData.data.observations ?? ""
        });

    }, [mode, assemblyData, reset]);

    const onSubmit = (data: ProductAssemblyFormData) => {

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
                    <Label className="mb-1">Producto a ensamblar</Label>
                    <Controller
                        control={control}
                        name="productId"
                        render={({ field }) => {

                            const items = assemblableProducts.map(product => ({
                                value: product.id,
                                label: `${product.internalCode} - ${product.name}`
                            }));

                            const selected = items.find(item => item.value === field.value) ?? null;

                            return (
                                <Combobox
                                    items={items}
                                    value={selected}
                                    onValueChange={(item) => field.onChange(item ? item.value : "")}
                                >
                                    <ComboboxInput placeholder="Buscar producto..." />
                                    <ComboboxContent>
                                        {(item) => (
                                            <ComboboxItem key={item.value} value={item}>
                                                {item.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxContent>
                                    <ComboboxEmpty>
                                        Ningún producto tiene una receta de componentes o piezas definida.
                                    </ComboboxEmpty>
                                </Combobox>
                            );

                        }}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                        Solo aparecen productos con receta definida (se define en el formulario de Productos).
                    </p>
                    <p className="text-sm text-red-500">{errors.productId?.message}</p>
                </div>

                <div className="md:col-span-2">
                    <Label className="mb-1">Observaciones (opcional)</Label>
                    <Input {...register("observations")} />
                </div>

            </div>

            {productId && Number(quantity) > 0 && (

                <div className="space-y-4 rounded-lg border p-3">

                    {isPreviewLoading && <p className="text-sm text-muted-foreground">Calculando...</p>}

                    {preview && (
                        <>
                            {preview.components.length > 0 && (
                                <div>
                                    <p className="mb-2 font-medium">Componentes requeridos (bodega principal)</p>
                                    <div className="space-y-2">
                                        {preview.components.map(item => (
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

                            {preview.parts.length > 0 && (
                                <div>
                                    <p className="mb-2 font-medium">Piezas requeridas (inventario de producción)</p>
                                    <div className="space-y-2">
                                        {preview.parts.map(item => (
                                            <div
                                                key={item.partId}
                                                className="flex items-center justify-between border-b pb-2 text-sm last:border-b-0"
                                            >
                                                <span>{item.partCode} - {item.partName}</span>
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
