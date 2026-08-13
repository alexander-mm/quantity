import { useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
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
import { partSchema } from "@/validators";
import type { PartFormData } from "@/validators";
import {
    useCreatePart,
    useUpdatePart,
    usePart,
    useParts,
    useProducts,
    usePartComponents,
    useSetPartComponents,
    usePartComponentProducts,
    useSetPartComponentProducts
} from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    partId?: string;
};

export function PartForm({ onSuccess, mode = "create", partId }: Props) {

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<PartFormData>({
        resolver: zodResolver(partSchema),
        defaultValues: {
            code: "",
            name: "",
            description: "",
            minimumStock: undefined,
            initialQuantity: undefined,
            components: []
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "components" });

    const createMutation = useCreatePart();
    const updateMutation = useUpdatePart();
    const { data: partData } = usePart(mode === "edit" ? partId : undefined);
    const { data: componentsData } = usePartComponents(mode === "edit" ? partId : undefined);
    const { data: componentProductsData } = usePartComponentProducts(mode === "edit" ? partId : undefined);
    const { data: partsData } = useParts();
    const { data: productsData } = useProducts();
    const setComponentsMutation = useSetPartComponents();
    const setComponentProductsMutation = useSetPartComponentProducts();
    const loading = createMutation.isPending || updateMutation.isPending;

    const parts = (partsData?.data ?? []).filter(part => part.id !== partId);
    const products = productsData?.data ?? [];

    useEffect(() => {

        if (mode !== "edit" || !partData?.data) {
            return;
        }

        reset({
            code: partData.data.code,
            name: partData.data.name,
            description: partData.data.description ?? "",
            minimumStock: Number(partData.data.minimumStock),
            components: [
                ...(componentsData?.data ?? []).map(item => ({
                    type: "PART" as const,
                    refId: item.componentPartId,
                    quantity: Number(item.quantity)
                })),
                ...(componentProductsData?.data ?? []).map(item => ({
                    type: "PRODUCT" as const,
                    refId: item.componentProductId,
                    quantity: Number(item.quantity)
                }))
            ]
        });

    }, [mode, partData, componentsData, componentProductsData, reset]);

    async function saveComponents(targetPartId: string, components: PartFormData["components"]) {

        const items = components ?? [];
        const partComponents = items.filter(item => item.type === "PART" && item.refId);
        const productComponents = items.filter(item => item.type === "PRODUCT" && item.refId);

        await Promise.all([
            setComponentsMutation.mutateAsync({
                partId: targetPartId,
                data: {
                    components: partComponents.map(item => ({
                        componentPartId: item.refId,
                        quantity: Number(item.quantity)
                    }))
                }
            }),
            setComponentProductsMutation.mutateAsync({
                partId: targetPartId,
                data: {
                    products: productComponents.map(item => ({
                        componentProductId: item.refId,
                        quantity: Number(item.quantity)
                    }))
                }
            })
        ]);

    }

    const onSubmit = (data: PartFormData) => {

        const { components, ...rest } = data;

        const payload = {
            code: rest.code,
            name: rest.name,
            description: rest.description || undefined,
            minimumStock: Number(rest.minimumStock) || 0,
            ...(mode === "create" ? { initialQuantity: Number(rest.initialQuantity) || undefined } : {})
        };

        const onError = (error: unknown) => {
            const message =
                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                    ? error.response.data.message
                    : "No se pudo guardar la pieza.";
            toast.error(message);
        };

        if (mode === "edit" && partId) {
            updateMutation.mutate({ id: partId, data: payload }, {
                onSuccess: async () => {

                    try {
                        await saveComponents(partId, components);
                    } catch {
                        toast.error("La pieza se actualizó, pero no se pudo guardar la receta de ensamblaje.");
                    }

                    toast.success("Pieza actualizada correctamente.");
                    onSuccess?.();
                },
                onError
            });
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: async (response) => {

                try {
                    await saveComponents(response.data.id, components);
                } catch {
                    toast.error("La pieza se creó, pero no se pudo guardar la receta de ensamblaje.");
                }

                toast.success("Pieza creada correctamente.");
                reset();
                onSuccess?.();
            },
            onError
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-5">

            <div>
                <Label className="mb-1">Código</Label>
                <Input {...register("code")} />
                <p className="text-sm text-red-500">{errors.code?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Nombre</Label>
                <Input {...register("name")} />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Descripción (opcional)</Label>
                <Input {...register("description")} />
            </div>

            <div>
                <Label className="mb-1">Stock mínimo</Label>
                <Input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="0"
                    {...register("minimumStock", {
                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                    })}
                />
                <p className="text-xs text-muted-foreground">
                    Cuando la existencia llegue a este nivel o por debajo, se marcará como stock bajo.
                </p>
                <p className="text-sm text-red-500">{errors.minimumStock?.message}</p>
            </div>

            {mode === "create" && (
                <div>
                    <Label className="mb-1">Cantidad a cargar (opcional)</Label>
                    <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="0"
                        {...register("initialQuantity", {
                            setValueAs: (v) => (v === "" ? undefined : Number(v))
                        })}
                    />
                    <p className="text-xs text-muted-foreground">
                        Si la pieza ya tiene unidades producidas, regístralas aquí para dejar la pieza creada
                        con su stock inicial en un solo paso. Déjalo vacío si aún no hay producción.
                    </p>
                    <p className="text-sm text-red-500">{errors.initialQuantity?.message}</p>
                </div>
            )}

            <div className="space-y-3 rounded-lg border p-3">

                <div>
                    <Label className="mb-1">Receta de ensamblaje (opcional)</Label>
                    <p className="text-xs text-muted-foreground">
                        Si esta pieza se arma a partir de otras piezas y/o de productos del inventario, defínelos
                        aquí. Esto habilita el ensamblaje de esta pieza: al producirla, se descontará
                        automáticamente cada pieza componente del inventario de piezas y cada producto componente
                        de la bodega principal.
                    </p>
                </div>

                {fields.map((field, index) => {

                    const type = field.type;
                    const isProduct = type === "PRODUCT";
                    const options = isProduct
                        ? products.map(product => ({ value: product.id, label: `${product.internalCode} - ${product.name}` }))
                        : parts.map(part => ({ value: part.id, label: `${part.code} - ${part.name}` }));

                    return (

                        <div key={field.id} className="flex items-end gap-2 rounded-md border p-2">

                            <div className="flex-1">
                                <Label className="mb-1">{isProduct ? "Producto componente" : "Pieza componente"}</Label>
                                <Controller
                                    control={control}
                                    name={`components.${index}.refId`}
                                    render={({ field: controllerField }) => {

                                        const selected = options.find(item => item.value === controllerField.value) ?? null;

                                        return (
                                            <Combobox
                                                items={options}
                                                value={selected}
                                                onValueChange={(item) => controllerField.onChange(item ? item.value : "")}
                                            >
                                                <ComboboxInput placeholder={isProduct ? "Buscar producto..." : "Buscar pieza..."} readOnly={!!selected} />
                                                <ComboboxContent>
                                                    {(item) => (
                                                        <ComboboxItem key={item.value} value={item}>
                                                            {item.label}
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxContent>
                                                <ComboboxEmpty>
                                                    {isProduct ? "No se encontraron productos." : "No se encontraron piezas."}
                                                </ComboboxEmpty>
                                            </Combobox>
                                        );

                                    }}
                                />
                            </div>

                            <div className="w-28">
                                <Label className="mb-1">Cantidad</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    step="1"
                                    placeholder="0"
                                    {...register(`components.${index}.quantity`, {
                                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                                    })}
                                />
                            </div>

                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                <Trash2 size={18} className="text-red-500" />
                            </Button>

                        </div>

                    );

                })}

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ type: "PART", refId: "", quantity: undefined })}
                    >
                        <Plus size={18} />
                        Agregar pieza
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ type: "PRODUCT", refId: "", quantity: undefined })}
                    >
                        <Plus size={18} />
                        Agregar producto
                    </Button>
                </div>

            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}