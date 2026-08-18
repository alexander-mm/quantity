import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { useEffect, useState } from "react";
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
import {
    useCategories,
    useCreateCategory,
    useCreateProduct,
    useUpdateProduct,
    useProduct,
    useProducts,
    useProductComponents,
    useSetProductComponents,
    useParts,
    useEquipmentParts,
    useSetEquipmentParts,
    useProductPriceEntries,
    useReplaceProductPriceEntries
} from "@/hooks";
import { toast } from "react-hot-toast";

type ProductFormProps = {
    onSuccess?: () => void;
    onCancel?: () => void;
    mode?: "create" | "edit";
    productId?: string;
};

export function ProductForm({

    onSuccess,
    onCancel,
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
            costPrice: undefined,
            pvp: 0,
            pvpCop: 0,
            minimumStock: undefined,
            assembleOnSale: false,
            components: [],
            priceEntries: []
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "components" });
    const { fields: priceEntryFields, append: appendPriceEntry, remove: removePriceEntry } = useFieldArray({ control, name: "priceEntries" });

    const { data: categoriesData } = useCategories();
    const { data: productsData } = useProducts();
    const createProductMutation = useCreateProduct();
    const createCategoryMutation = useCreateCategory();
    const [categoryInput, setCategoryInput] = useState("");
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
    const { data: equipmentPartsData } = useEquipmentParts(
        mode === "edit"
            ? productId
            : undefined
    );
    const { data: partsData } = useParts();
    const { data: productPriceEntriesData } = useProductPriceEntries(
        mode === "edit" ? productId : undefined
    );
    const updateProductMutation = useUpdateProduct();
    const setComponentsMutation = useSetProductComponents();
    const setEquipmentPartsMutation = useSetEquipmentParts();
    const replacePriceEntriesMutation = useReplaceProductPriceEntries();
    const categories = categoriesData?.data ?? [];
    const products = (productsData?.data ?? []).filter(product => product.id !== productId);
    const parts = partsData?.data ?? [];

    const watchedComponents = useWatch({ control, name: "components" }) ?? [];
    const watchedPriceEntries = useWatch({ control, name: "priceEntries" }) ?? [];
    const validComponents = watchedComponents.filter(item => item?.refId);

    useEffect(() => {

        if (validComponents.length === 0) {
            return;
        }

        const total = validComponents.reduce((sum, item) => {

            const unitCost = item.type === "PART"
                ? Number(parts.find(part => part.id === item.refId)?.cost ?? 0)
                : Number(products.find(product => product.id === item.refId)?.costPrice ?? 0);

            return sum + unitCost * (Number(item.quantity) || 0);

        }, 0);

        setValue("costPrice", total);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(validComponents), parts, products]);

    useEffect(() => {

        const firstUsdEntry = watchedPriceEntries.find(item => item?.currency === "USD");
        const firstCopEntry = watchedPriceEntries.find(item => item?.currency === "COP");

        setValue("pvp", firstUsdEntry ? Number(firstUsdEntry.price) || 0 : 0);
        setValue("pvpCop", firstCopEntry ? Number(firstCopEntry.price) || 0 : 0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(watchedPriceEntries), setValue]);

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
            assembleOnSale: productData.data.assembleOnSale ?? false,
            components: [
                ...(componentsData?.data ?? []).map(item => ({
                    type: "PRODUCT" as const,
                    refId: item.componentProductId,
                    quantity: Number(item.quantity)
                })),
                ...(equipmentPartsData?.data ?? []).map(item => ({
                    type: "PART" as const,
                    refId: item.partId,
                    quantity: Number(item.quantity)
                }))
            ],
            priceEntries: (productPriceEntriesData?.data ?? []).map(item => ({
                currency: item.currency,
                price: Number(item.price)
            }))
        });
    }, [
        mode,
        productData,
        componentsData,
        equipmentPartsData,
        productPriceEntriesData,
        reset
    ]);

    async function saveComponents(targetProductId: string, components: ProductFormData["components"]) {

        const items = components ?? [];
        const productComponents = items.filter(item => item.type === "PRODUCT" && item.refId);
        const partComponents = items.filter(item => item.type === "PART" && item.refId);

        await Promise.all([
            setComponentsMutation.mutateAsync({
                productId: targetProductId,
                data: {
                    components: productComponents.map(item => ({
                        componentProductId: item.refId,
                        quantity: Number(item.quantity)
                    }))
                }
            }),
            setEquipmentPartsMutation.mutateAsync({
                productId: targetProductId,
                data: {
                    parts: partComponents.map(item => ({
                        partId: item.refId,
                        quantity: Number(item.quantity)
                    }))
                }
            })
        ]);

    }

    async function savePriceEntries(targetProductId: string, priceEntries: ProductFormData["priceEntries"]) {

        const items = priceEntries ?? [];
        const sequenceByCurrency: Record<string, number> = {};

        const entries = items.map(item => {
            sequenceByCurrency[item.currency] = (sequenceByCurrency[item.currency] ?? 0) + 1;
            return {
                currency: item.currency,
                sequence: sequenceByCurrency[item.currency],
                price: Number(item.price)
            };
        });

        await replacePriceEntriesMutation.mutateAsync({
            productId: targetProductId,
            data: { entries }
        });

    }

    async function onSubmit(data: ProductFormData) {

        const { components, priceEntries, ...productData } = data;

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

                    try {
                        await savePriceEntries(response.data.id, priceEntries);
                    } catch {
                        toast.error("El producto se creó, pero no se pudieron guardar los precios de venta.");
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

                try {
                    await savePriceEntries(productId, priceEntries);
                } catch {
                    toast.error("El producto se actualizó, pero no se pudieron guardar los precios de venta.");
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
            onSubmit={handleSubmit(onSubmit, onFormError)}
            noValidate
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
                    render={({ field }) => {

                        const items = categories.map(category => ({
                            value: category.id,
                            label: category.name
                        }));

                        const selected = items.find(item => item.value === field.value) ?? null;

                        const trimmedInput = categoryInput.trim();

                        const hasExactMatch = categories.some(
                            category => category.name.toLowerCase() === trimmedInput.toLowerCase()
                        );

                        const comboboxItems = trimmedInput && !hasExactMatch
                            ? [...items, { value: "__create__", label: `Crear categoría "${trimmedInput}"` }]
                            : items;

                        return (

                            <Combobox
                                items={comboboxItems}
                                value={selected}
                                onInputValueChange={setCategoryInput}
                                onValueChange={(item) => {

                                    if (!item) {
                                        field.onChange("");
                                        return;
                                    }

                                    if (item.value === "__create__") {

                                        createCategoryMutation.mutate({ name: trimmedInput }, {
                                            onSuccess: (response) => {
                                                field.onChange(response.data.id);
                                                setCategoryInput("");
                                                toast.success(`Categoría "${response.data.name}" creada.`);
                                            },
                                            onError: () => {
                                                toast.error("No se pudo crear la categoría.");
                                            }
                                        });

                                        return;

                                    }

                                    field.onChange(item.value);

                                }}
                            >

                                <ComboboxInput
                                    placeholder="Buscar o escribir para crear una categoría..."
                                />

                                <ComboboxContent>
                                    {(item) => (
                                        <ComboboxItem key={item.value} value={item}>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxContent>

                                <ComboboxEmpty>
                                    No se encontraron categorías.
                                </ComboboxEmpty>

                            </Combobox>

                        );

                    }}
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
                        Si este producto se arma a partir de otros productos del inventario y/o de piezas cortadas
                        en producción (láser/tubo), defínelos aquí. Esto habilita el ensamblaje: al producirlo, se
                        descontará automáticamente cada componente-producto de la bodega principal y cada pieza del
                        inventario de piezas.
                    </p>
                </div>

                {fields.length > 0 && (
                    <div className="flex items-start gap-2 rounded-md border p-2">
                        <input
                            type="checkbox"
                            id="assembleOnSale"
                            className="mt-1"
                            {...register("assembleOnSale")}
                        />
                        <label htmlFor="assembleOnSale" className="cursor-pointer">
                            <span className="block text-sm font-medium">Es un kit: se arma al momento de vender</span>
                            <span className="block text-xs text-muted-foreground">
                                Al confirmar una venta de este producto, se descuentan directamente sus componentes/piezas
                                (no este producto). Déjalo desmarcado si es un Equipo que se ensambla por lotes en taller
                                antes de venderse — en ese caso la venta descuenta el stock ya armado del equipo, y se
                                bloquea si no queda stock armado.
                            </span>
                        </label>
                    </div>
                )}

                {fields.map((field, index) => {

                    const type = field.type;
                    const isPart = type === "PART";

                    const usedRefIds = new Set(
                        watchedComponents
                            .filter((component, componentIndex) => componentIndex !== index && component?.type === type)
                            .map(component => component?.refId)
                            .filter(Boolean)
                    );

                    const options = isPart
                        ? parts.filter(part => !usedRefIds.has(part.id)).map(part => ({ value: part.id, label: `${part.code} - ${part.name}` }))
                        : products.filter(product => !usedRefIds.has(product.id)).map(product => ({ value: product.id, label: `${product.internalCode} - ${product.name}` }));

                    return (

                        <div key={field.id} className="flex items-end gap-2 rounded-md border p-2">

                            <div className="flex-1">
                                <Label className="mb-1">{isPart ? "Pieza" : "Producto componente"}</Label>
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
                                                <ComboboxInput placeholder={isPart ? "Buscar pieza..." : "Buscar producto..."} readOnly={!!selected}/>
                                                <ComboboxContent>
                                                    {(item) => (
                                                        <ComboboxItem key={item.value} value={item}>
                                                            {item.label}
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxContent>
                                                <ComboboxEmpty>
                                                    {isPart ? "No se encontraron piezas." : "No se encontraron productos."}
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
                        onClick={() => append({ type: "PRODUCT", refId: "", quantity: undefined })}
                    >
                        <Plus size={18} />
                        Agregar producto
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ type: "PART", refId: "", quantity: undefined })}
                    >
                        <Plus size={18} />
                        Agregar pieza
                    </Button>
                </div>

            </div>

    
                <div className="mb-6">
                    <Label className="mb-1">
                        Precio de Costo
                    </Label>
                    <Input
                        type="number"
                        placeholder="0"
                        {...register("costPrice", {
                            setValueAs: (v) => (v === "" ? undefined : Number(v))
                        })}
                    />
                    {validComponents.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            Calculado automáticamente sumando el costo de los componentes definidos arriba.
                        </p>
                    )}
                    <p className="text-sm text-red-500">
                        {errors.costPrice?.message}
                    </p>
                </div>
            <div className="space-y-3 rounded-lg border p-3 mb-6">

                <div>
                    <Label className="mb-1">Precios de Venta</Label>
                    <p className="text-xs text-muted-foreground">
                        Agrega tantos precios como necesites, en USD y/o en COP. Se numeran automáticamente
                        (PVP USD 1, PVP USD 2, PVP COP 1...) según el orden en que los agregues. PVP USD 1 y
                        PVP COP 1 se usan como precio base del producto para el resto de los procesos
                        (perfiles de descuento, compras, etc.).
                    </p>
                </div>

                {priceEntryFields.map((field, index) => {

                    const currency = watchedPriceEntries[index]?.currency ?? field.currency;
                    const sequence = watchedPriceEntries
                        .slice(0, index + 1)
                        .filter(item => item?.currency === currency)
                        .length;

                    return (

                        <div key={field.id} className="flex items-end gap-2 rounded-md border p-2">

                            <div className="w-24">
                                <Label className="mb-1">Etiqueta</Label>
                                <Input readOnly disabled value={`PVP ${currency} ${sequence}`} />
                            </div>

                            <div className="w-32">
                                <Label className="mb-1">Precio</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="0"
                                    {...register(`priceEntries.${index}.price`, {
                                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                                    })}
                                />
                            </div>

                            <Button type="button" variant="ghost" size="icon" onClick={() => removePriceEntry(index)}>
                                <Trash2 size={18} className="text-red-500" />
                            </Button>

                        </div>

                    );

                })}

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => appendPriceEntry({ currency: "USD", price: undefined })}
                    >
                        <Plus size={18} />
                        Agregar precio USD
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => appendPriceEntry({ currency: "COP", price: undefined })}
                    >
                        <Plus size={18} />
                        Agregar precio COP
                    </Button>
                </div>

                <p className="text-sm text-red-500">
                    {errors.pvp?.message ? "Debes agregar al menos un precio en USD (será el PVP USD 1)." : ""}
                </p>

            </div>

            <div>
                <Label>
                    Stock Mínimo en Inventario
                </Label>
                <Input
                    type="number"
                    placeholder="0"
                    {...register("minimumStock", {
                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                    })}
                />
                <p className="text-sm text-red-500">
                    {errors.minimumStock?.message}
                </p>
            </div>



            <div className="flex justify-end gap-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
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
