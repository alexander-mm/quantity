import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { productSchema } from "@/validators";
import type { ProductFormData } from "@/validators";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    useCategories,
    useCreateProduct,
    useUpdateProduct,
    useProduct,
    useProducts,
    useProductComponents,
    useSetProductComponents
} from "@/hooks";
import { toast } from "react-hot-toast";

type ProductFormProps = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    productId?: string;
};

export function ProductForm({

    onSuccess,
    mode = "create",
    productId
}: ProductFormProps) {

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        formState: {
            errors
        }
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            internalCode: "",
            barcode: "",
            name: "",
            description: "",
            brand: "",
            categoryId: "",
            unitOfMeasure: "",
            costPrice: 0,
            pvp: 0,
            pvpCop: 0,
            minimumStock: 0,
            components: []
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "components" });

    const { data: categoriesData } = useCategories();
    const { data: productsData } = useProducts();
    const createProductMutation = useCreateProduct();
    const { data: productData } = useProduct(
        mode === "edit"
            ? productId
            : undefined
    );
    const { data: componentsData } = useProductComponents(
        mode === "edit"
            ? productId
            : undefined
    );
    const updateProductMutation = useUpdateProduct();
    const setComponentsMutation = useSetProductComponents();
    const categories = categoriesData?.data ?? [];
    const products = (productsData?.data ?? []).filter(product => product.id !== productId);

    const watchedComponents = useWatch({ control, name: "components" }) ?? [];
    const validComponents = watchedComponents.filter(item => item?.componentProductId);

    useEffect(() => {

        if (validComponents.length === 0) {
            return;
        }

        const total = validComponents.reduce((sum, item) => {

            const componentProduct = products.find(product => product.id === item.componentProductId);
            const unitCost = componentProduct ? Number(componentProduct.costPrice ?? 0) : 0;

            return sum + unitCost * (Number(item.quantity) || 0);

        }, 0);

        setValue("costPrice", total);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(validComponents), products]);

    useEffect(() => {

        if (
            mode !== "edit" ||
            !productData?.data
        ) {
            return;
        }

        reset({

            internalCode: productData.data.internalCode,
            barcode: productData.data.barcode ?? "",
            name: productData.data.name,
            description: productData.data.description ?? "",
            brand: productData.data.brand,
            categoryId: productData.data.categoryId,
            unitOfMeasure: productData.data.unitOfMeasure,
            costPrice: Number(productData.data.costPrice),
            pvp: Number(productData.data.pvp),
            pvpCop: productData.data.pvpCop ? Number(productData.data.pvpCop) : 0,
            minimumStock: Number(productData.data.minimumStock),
            components: (componentsData?.data ?? []).map(item => ({
                componentProductId: item.componentProductId,
                quantity: Number(item.quantity)
            }))
        });
    }, [
        mode,
        productData,
        componentsData,
        reset
    ]);

    async function saveComponents(targetProductId: string, components: ProductFormData["components"]) {

        await setComponentsMutation.mutateAsync({
            productId: targetProductId,
            data: {
                components: (components ?? [])
                    .filter(item => item.componentProductId)
                    .map(item => ({
                        componentProductId: item.componentProductId,
                        quantity: Number(item.quantity)
                    }))
            }
        });

    }

    async function onSubmit(data: ProductFormData) {

        const { components, ...productData } = data;

        const payload = {
            ...productData,
            costPrice: Number(productData.costPrice),
            pvp: Number(productData.pvp),
            pvpCop: Number(productData.pvpCop) || undefined,
            minimumStock: Number(productData.minimumStock)
        };

        if (mode === "create") {
            createProductMutation.mutate(payload, {
                onSuccess: async (response) => {

                    try {
                        await saveComponents(response.data.id, components);
                    } catch {
                        toast.error("El producto se creó, pero no se pudo guardar la receta de componentes.");
                    }

                    toast.success("Producto creado correctamente.");
                    reset();
                    onSuccess?.();
                },
                onError: (error) => {
                    console.error(error);
                    toast.error("No se pudo crear el producto.");
                }
            });
            return;
        }

        if (!productId) {

            toast.error("No se encontró el producto.");
            return;
        }
        updateProductMutation.mutate({
            id: productId,
            data: payload
        }, {
            onSuccess: async () => {

                try {
                    await saveComponents(productId, components);
                } catch {
                    toast.error("El producto se actualizó, pero no se pudo guardar la receta de componentes.");
                }

                toast.success("Producto actualizado correctamente.");
                reset();
                onSuccess?.();
            },
            onError: (error) => {
                console.error(error);
                toast.error("No se pudo actualizar el producto.");
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 h-full"
        >
            <div className="mb-3">
                <Label className="mb-1">
                    Código interno
                </Label>
                <Input
                    {...register("internalCode")}
                />
                <p className="text-sm text-red-500">
                    {errors.internalCode?.message}
                </p>
            </div>
            <div className="mb-3">
                <Label className="mb-1">
                    Código de barras
                </Label>
                <Input
                    {...register("barcode")}
                />
            </div>

            <div className="mb-3">
                <Label className="mb-1">
                    Nombre
                </Label>
                <Input
                    {...register("name")}
                />
                <p className="text-sm text-red-500">
                    {errors.name?.message}
                </p>
            </div>

            <div className="mb-3">
                <Label className="mb-1">
                    Descripción
                </Label>
                <Input
                    {...register("description")}
                />
            </div>

            <div className="mb-3">
                <Label className="mb-1">
                    Marca
                </Label>

                <Input
                    {...register("brand")}
                    placeholder="Ingrese la marca"
                />

                <p className="text-sm text-red-500">
                    {errors.brand?.message}
                </p>
            </div>

            <div className="mb-3">
                <Label className="mb-1">
                    Categoría
                </Label>
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (

                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                <p className="text-sm text-red-500">
                    {errors.categoryId?.message}
                </p>
            </div>

            <div className="mb-6">
                <Label className="mb-1">
                    Unidad de medida
                </Label>

                <Input
                    {...register("unitOfMeasure")}
                    placeholder="Ej. Unidad, Caja, Metro..."
                />

                <p className="text-sm text-red-500">
                    {errors.unitOfMeasure?.message}
                </p>
            </div>

            <div className="space-y-3 rounded-lg border p-3 mb-6">

                <div>
                    <Label className="mb-1">Componentes (opcional)</Label>
                    <p className="text-xs text-muted-foreground">
                        Si este producto se arma a partir de otros productos del inventario (ej. un kit o producto
                        terminado), defínelos aquí. Esto habilita el ensamblaje: al producirlo, se descontará
                        automáticamente cada componente de la bodega principal.
                    </p>
                </div>

                {fields.map((field, index) => (

                    <div key={field.id} className="flex items-end gap-2 rounded-md border p-2">

                        <div className="flex-1">
                            <Label className="mb-1">Producto componente</Label>
                            <Controller
                                control={control}
                                name={`components.${index}.componentProductId`}
                                render={({ field: controllerField }) => {

                                    const items = products.map(product => ({
                                        value: product.id,
                                        label: `${product.internalCode} - ${product.name}`
                                    }));

                                    const selected = items.find(item => item.value === controllerField.value) ?? null;

                                    return (
                                        <Combobox
                                            items={items}
                                            value={selected}
                                            onValueChange={(item) => controllerField.onChange(item ? item.value : "")}
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
                                                No se encontraron productos.
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
                                {...register(`components.${index}.quantity`, { valueAsNumber: true })}
                            />
                        </div>

                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 size={18} className="text-red-500" />
                        </Button>

                    </div>

                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ componentProductId: "", quantity: 1 })}
                >
                    <Plus size={18} />
                    Agregar componente
                </Button>

            </div>


            <div className="mb-3">
                <Label className="mb-1">
                    Costo
                </Label>
                <Input
                    type="number"
                    {...register("costPrice")}
                />
                {validComponents.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                        Calculado automáticamente sumando el costo de los componentes definidos abajo.
                    </p>
                )}
                <p className="text-sm text-red-500">
                    {errors.costPrice?.message}
                </p>
            </div>

            <div className="mb-3">
                <Label className="mb-1">
                    PVP (USD)
                </Label>
                <Input
                    type="number"
                    step="0.01"
                    {...register("pvp")}
                />
                <p className="text-sm text-muted-foreground">
                    Se calcula automáticamente el precio para todos los perfiles de precio activos, como
                    descuento sobre este valor.
                </p>
                <p className="text-sm text-red-500">
                    {errors.pvp?.message}
                </p>
            </div>

            <div className="mb-3">
                <Label className="mb-1">
                    PVP (COP)
                </Label>
                <Input
                    type="number"
                    step="1"
                    min="0"
                    {...register("pvpCop")}
                />
                <p className="text-sm text-muted-foreground">
                    Escribe el valor completo, sin puntos ni comas — ej: <strong>450000</strong> para $450.000.
                    Déjalo en 0 si este producto no se vende en COP. Los perfiles de precio también se calculan sobre este valor.
                </p>
                <p className="text-sm text-red-500">
                    {errors.pvpCop?.message}
                </p>
            </div>

            <div>
                <Label>
                    Stock mínimo
                </Label>
                <Input
                    type="number"
                    {...register("minimumStock")}
                />
                <p className="text-sm text-red-500">
                    {errors.minimumStock?.message}
                </p>
            </div>



            <div className="flex justify-end gap-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                >
                    Guardar
                </Button>
            </div>
        </form>
    );
}
