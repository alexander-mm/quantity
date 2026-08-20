import { useEffect, useState, type ChangeEvent } from "react";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
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
import { getNextSequentialCode, matchProductByBarcode, calculatePartCost } from "@/lib";
import {
    useCreatePart,
    useUpdatePart,
    usePart,
    useParts,
    useProducts,
    usePartCategories,
    usePartComponents,
    useSetPartComponents,
    usePartComponentProducts,
    useSetPartComponentProducts,
    usePartRecipe,
    useSetPartRecipe
} from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    partId?: string;
};

function uppercaseOnChange(e: ChangeEvent<HTMLInputElement>) {
    e.target.value = e.target.value.toUpperCase();
}

export function PartForm({ onSuccess, mode = "create", partId }: Props) {

    const { register, control, handleSubmit, reset, setError, setValue, formState: { errors } } = useForm<PartFormData>({
        resolver: zodResolver(partSchema),
        defaultValues: {
            code: "",
            name: "",
            description: "",
            categoryId: "",
            minimumStock: undefined,
            cost: undefined,
            initialQuantity: undefined,
            components: [],
            laserMeters: undefined,
            usesMechanicalCut: false,
            bendCount: undefined,
            curveCount: undefined,
            weldingCost: undefined,
            otherCostDescription: "",
            otherCostAmount: undefined
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "components" });
    const watchedComponents = useWatch({ control, name: "components" }) ?? [];
    const categoryId = useWatch({ control, name: "categoryId" });
    const laserMetersWatch = useWatch({ control, name: "laserMeters" });
    const usesMechanicalCutWatch = useWatch({ control, name: "usesMechanicalCut" });
    const bendCountWatch = useWatch({ control, name: "bendCount" });
    const curveCountWatch = useWatch({ control, name: "curveCount" });
    const weldingCostWatch = useWatch({ control, name: "weldingCost" });
    const otherCostAmountWatch = useWatch({ control, name: "otherCostAmount" });

    // El check de cada campo es un estado propio, independiente de si ya tiene un numero
    // cargado — asi al tildarlo el input queda vacio (solo el placeholder "0"), en vez de
    // forzar un valor. Se sincroniza contra los datos cargados durante el render (no en un
    // efecto) comparando el id, siguiendo el patron recomendado para "ajustar estado" de React.
    // Laser/mecanico/doblez/curvado dependen de la receta de corte (necesitan una materia
    // prima de la cual sacar la tarifa); soldadura/otro viven en la Pieza y no dependen de eso.
    const [loadedRecipeId, setLoadedRecipeId] = useState<string | undefined>(undefined);
    const [laserEnabled, setLaserEnabled] = useState(false);
    const [bendEnabled, setBendEnabled] = useState(false);
    const [curveEnabled, setCurveEnabled] = useState(false);
    const [loadedPartId, setLoadedPartId] = useState<string | undefined>(undefined);
    const [weldingEnabled, setWeldingEnabled] = useState(false);
    const [otherEnabled, setOtherEnabled] = useState(false);

    const createMutation = useCreatePart();
    const updateMutation = useUpdatePart();
    const { data: partData } = usePart(mode === "edit" ? partId : undefined);
    const { data: componentsData } = usePartComponents(mode === "edit" ? partId : undefined);
    const { data: componentProductsData } = usePartComponentProducts(mode === "edit" ? partId : undefined);
    const { data: recipeData } = usePartRecipe(mode === "edit" ? partId : undefined);
    const { data: partsData } = useParts();
    const { data: productsData } = useProducts();
    const { data: partCategoriesData } = usePartCategories();
    const setComponentsMutation = useSetPartComponents();
    const setComponentProductsMutation = useSetPartComponentProducts();
    const setRecipeMutation = useSetPartRecipe();
    const loading = createMutation.isPending || updateMutation.isPending;

    // El costeo por corte solo aplica si la pieza ya tiene una receta de corte definida
    // (materia prima + piezas por unidad se cargan aparte, en "Recetas de corte").
    const recipe = recipeData?.data;
    const hasCuttingRecipe = !!recipe;

    if (recipe && recipe.id !== loadedRecipeId) {
        setLoadedRecipeId(recipe.id);
        setLaserEnabled(recipe.laserMeters !== null);
        setBendEnabled(recipe.bendCount !== null);
        setCurveEnabled(recipe.curveCount !== null);
    }

    if (partData?.data && partData.data.id !== loadedPartId) {
        setLoadedPartId(partData.data.id);
        setWeldingEnabled(partData.data.weldingCost !== null);
        setOtherEnabled(partData.data.otherCostAmount !== null);
    }

    const parts = (partsData?.data ?? []).filter(part => part.id !== partId);
    const products = productsData?.data ?? [];
    const partCategories = partCategoriesData?.data ?? [];

    const validComponents = watchedComponents.filter(item => item?.refId);
    const validComponentsKey = JSON.stringify(validComponents);

    useEffect(() => {

        if (mode !== "create" || !partsData?.data || !categoryId) {
            return;
        }

        const lastPartInCategory = partsData.data.find(
            part => part.categoryId === categoryId
        );

        setValue(
            "code",
            getNextSequentialCode(lastPartInCategory?.code)
        );

    }, [mode, categoryId, partsData, setValue]);

    useEffect(() => {

        if (hasCuttingRecipe || (validComponents.length === 0 && !weldingEnabled && !otherEnabled)) {
            return;
        }

        const componentsTotal = validComponents.reduce((sum, item) => {

            const unitCost = item.type === "PART"
                ? Number(parts.find(part => part.id === item.refId)?.cost ?? 0)
                : Number(products.find(product => product.id === item.refId)?.costPrice ?? 0);

            return sum + unitCost * (Number(item.quantity) || 0);

        }, 0);

        const weldingCost = weldingEnabled ? (Number(weldingCostWatch) || 0) : 0;
        const otherCost = otherEnabled ? (Number(otherCostAmountWatch) || 0) : 0;

        setValue("cost", componentsTotal + weldingCost + otherCost);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        validComponentsKey,
        parts,
        products,
        hasCuttingRecipe,
        weldingEnabled,
        otherEnabled,
        weldingCostWatch,
        otherCostAmountWatch,
        setValue
    ]);

    useEffect(() => {

        if (!recipe) {
            return;
        }

        const cost = calculatePartCost(recipe.rawMaterial, {
            piecesPerUnit: Number(recipe.piecesPerUnit) || undefined,
            laserMeters: laserEnabled ? (Number(laserMetersWatch) || 0) : undefined,
            usesMechanicalCut: !!usesMechanicalCutWatch,
            bendCount: bendEnabled ? (Number(bendCountWatch) || 0) : undefined,
            curveCount: curveEnabled ? (Number(curveCountWatch) || 0) : undefined,
            weldingCost: weldingEnabled ? (Number(weldingCostWatch) || 0) : undefined,
            otherCostAmount: otherEnabled ? (Number(otherCostAmountWatch) || 0) : undefined
        });

        setValue("cost", cost);

    }, [
        recipe,
        laserMetersWatch,
        usesMechanicalCutWatch,
        bendCountWatch,
        curveCountWatch,
        weldingCostWatch,
        otherCostAmountWatch,
        laserEnabled,
        bendEnabled,
        curveEnabled,
        weldingEnabled,
        otherEnabled,
        setValue
    ]);

    useEffect(() => {

        if (mode !== "edit" || !partData?.data) {
            return;
        }

        reset({
            code: partData.data.code,
            name: partData.data.name,
            description: partData.data.description ?? "",
            categoryId: partData.data.categoryId ?? "",
            minimumStock: Number(partData.data.minimumStock),
            cost: Number(partData.data.cost),
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
            ],
            laserMeters: recipe?.laserMeters !== undefined && recipe?.laserMeters !== null ? Number(recipe.laserMeters) : undefined,
            usesMechanicalCut: recipe?.usesMechanicalCut ?? false,
            bendCount: recipe?.bendCount !== undefined && recipe?.bendCount !== null ? Number(recipe.bendCount) : undefined,
            curveCount: recipe?.curveCount !== undefined && recipe?.curveCount !== null ? Number(recipe.curveCount) : undefined,
            weldingCost: partData.data.weldingCost !== null ? Number(partData.data.weldingCost) : undefined,
            otherCostDescription: partData.data.otherCostDescription ?? "",
            otherCostAmount: partData.data.otherCostAmount !== null ? Number(partData.data.otherCostAmount) : undefined
        });

    }, [mode, partData, componentsData, componentProductsData, recipe, reset]);

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

    async function saveRecipeCosting(targetPartId: string, data: PartFormData) {

        // Solo hay algo que guardar si la pieza ya tiene receta de corte (materia prima +
        // piezas por unidad, que se cargan en "Recetas de corte") — reenviamos esos campos
        // tal cual estaban, y actualizamos únicamente laser/corte mecánico/doblez/curvado
        // (soldadura y "otro" viven en la Pieza, se guardan junto con el resto del formulario).
        if (!recipe) {
            return;
        }

        await setRecipeMutation.mutateAsync({
            partId: targetPartId,
            data: {
                rawMaterialId: recipe.rawMaterialId,
                pieceWidth: recipe.pieceWidth !== null ? Number(recipe.pieceWidth) : undefined,
                pieceHeight: recipe.pieceHeight !== null ? Number(recipe.pieceHeight) : undefined,
                pieceLength: recipe.pieceLength !== null ? Number(recipe.pieceLength) : undefined,
                piecesPerUnit: Number(recipe.piecesPerUnit),
                laserMeters: laserEnabled ? (Number(data.laserMeters) || 0) : undefined,
                usesMechanicalCut: !!data.usesMechanicalCut,
                bendCount: bendEnabled ? (Number(data.bendCount) || 0) : undefined,
                curveCount: curveEnabled ? (Number(data.curveCount) || 0) : undefined
            }
        });

    }

    const onSubmit = (data: PartFormData) => {

        const normalizedName = data.name.trim().toLowerCase();
        const isDuplicateName = parts.some(
            part => part.name.trim().toLowerCase() === normalizedName
        );

        if (isDuplicateName) {
            setError("name", { message: "Ya existe una pieza con este nombre." });
            return;
        }

        const { components, ...rest } = data;

        const payload = {
            code: rest.code,
            name: rest.name,
            description: rest.description || undefined,
            categoryId: rest.categoryId || undefined,
            minimumStock: Number(rest.minimumStock) || 0,
            cost: Number(rest.cost) || 0,
            weldingCost: weldingEnabled ? (Number(rest.weldingCost) || 0) : undefined,
            otherCostDescription: otherEnabled ? (rest.otherCostDescription || undefined) : undefined,
            otherCostAmount: otherEnabled ? (Number(rest.otherCostAmount) || 0) : undefined,
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
                        await saveRecipeCosting(partId, data);
                    } catch {
                        toast.error("La pieza se actualizó, pero no se pudo guardar el costeo.");
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
                <Label className="mb-1">Categoría</Label>
                <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => {

                        const items = partCategories.map(category => ({
                            value: category.id,
                            label: category.name
                        }));

                        const selected = items.find(item => item.value === field.value) ?? null;

                        return (
                            <Combobox
                                items={items}
                                value={selected}
                                onValueChange={(item) => field.onChange(item ? item.value : "")}
                            >
                                <ComboboxInput placeholder="Buscar categoría..." />
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
                <p className="text-xs text-muted-foreground">
                    Al elegir una categoría, el código se sugiere automáticamente en base a la última pieza registrada en esa categoría.
                </p>
                <p className="text-sm text-red-500">{errors.categoryId?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Código</Label>
                <Input {...register("code", { onChange: uppercaseOnChange })} />
                <p className="text-sm text-red-500">{errors.code?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Nombre</Label>
                <Input {...register("name", { onChange: uppercaseOnChange })} />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Descripción (opcional)</Label>
                <Input {...register("description", { onChange: uppercaseOnChange })} />
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

                    const usedRefIds = new Set(
                        watchedComponents
                            .filter((component, componentIndex) => componentIndex !== index && component?.type === type)
                            .map(component => component?.refId)
                            .filter(Boolean)
                    );

                    const availableProducts = products.filter(product => !usedRefIds.has(product.id));

                    const options = isProduct
                        ? availableProducts.map(product => ({ value: product.id, label: `${product.internalCode} - ${product.name}` }))
                        : parts.filter(part => !usedRefIds.has(part.id)).map(part => ({ value: part.id, label: `${part.code} - ${part.name}` }));

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
                                                onInputValueChange={(text) => {
                                                    if (!isProduct) {
                                                        return;
                                                    }
                                                    const match = matchProductByBarcode(availableProducts, text);
                                                    if (match) {
                                                        controllerField.onChange(match.id);
                                                    }
                                                }}
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

            <div className="space-y-3 rounded-lg border p-3">

                <div>
                    <Label className="mb-1">Costeo de corte (opcional)</Label>
                    <p className="text-xs text-muted-foreground">
                        Marca solo lo que aplica a esta pieza. La materia prima y las piezas por unidad se definen
                        en "Recetas de corte" — acá solo se cargan las operaciones que dependen de esa materia
                        prima (láser, corte mecánico, doblez, curvado).
                    </p>
                </div>

                {!hasCuttingRecipe && (
                    <p className="text-sm text-amber-600">
                        Esta pieza todavía no tiene una receta de corte, así que no aplican estas operaciones
                        (dependen de la tarifa de una materia prima). Si igual necesita soldadura u otro costo,
                        se cargan más abajo, en "Costos adicionales".
                    </p>
                )}

                {hasCuttingRecipe && recipe && (
                    <>

                        <div>
                            <p className="text-sm text-muted-foreground">Materia prima</p>
                            <p className="font-medium">{recipe.rawMaterial.code} - {recipe.rawMaterial.name}</p>
                        </div>

                        <div className="rounded-md border p-2">
                            <label htmlFor="usesMechanicalCut" className="flex cursor-pointer items-center gap-2">
                                <input type="checkbox" id="usesMechanicalCut" {...register("usesMechanicalCut")} />
                                <span className="text-sm font-medium">Usa corte mecánico</span>
                            </label>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Suma el monto fijo de corte mecánico de la materia prima elegida.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">

                            <div className="rounded-md border p-2">
                                <label htmlFor="laserEnabled" className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="laserEnabled"
                                        checked={laserEnabled}
                                        onChange={(e) => {
                                            setLaserEnabled(e.target.checked);
                                            if (!e.target.checked) setValue("laserMeters", undefined);
                                        }}
                                    />
                                    <span className="text-sm font-medium">Metros láser</span>
                                </label>
                                {laserEnabled && (
                                    <Input
                                        className="mt-2 w-24"
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        placeholder="0"
                                        {...register("laserMeters", {
                                            setValueAs: (v) => (v === "" ? undefined : Number(v))
                                        })}
                                    />
                                )}
                            </div>

                            <div className="rounded-md border p-2">
                                <label htmlFor="bendEnabled" className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="bendEnabled"
                                        checked={bendEnabled}
                                        onChange={(e) => {
                                            setBendEnabled(e.target.checked);
                                            if (!e.target.checked) setValue("bendCount", undefined);
                                        }}
                                    />
                                    <span className="text-sm font-medium">N.° dobleces</span>
                                </label>
                                {bendEnabled && (
                                    <Input
                                        className="mt-2 w-24"
                                        type="number"
                                        step="1"
                                        min={0}
                                        placeholder="0"
                                        {...register("bendCount", {
                                            setValueAs: (v) => (v === "" ? undefined : Number(v))
                                        })}
                                    />
                                )}
                            </div>

                            <div className="rounded-md border p-2">
                                <label htmlFor="curveEnabled" className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="curveEnabled"
                                        checked={curveEnabled}
                                        onChange={(e) => {
                                            setCurveEnabled(e.target.checked);
                                            if (!e.target.checked) setValue("curveCount", undefined);
                                        }}
                                    />
                                    <span className="text-sm font-medium">N.° curvas</span>
                                </label>
                                {curveEnabled && (
                                    <Input
                                        className="mt-2 w-24"
                                        type="number"
                                        step="1"
                                        min={0}
                                        placeholder="0"
                                        {...register("curveCount", {
                                            setValueAs: (v) => (v === "" ? undefined : Number(v))
                                        })}
                                    />
                                )}
                            </div>

                        </div>

                    </>
                )}

            </div>

            <div className="space-y-3 rounded-lg border p-3">

                <div>
                    <Label className="mb-1">Costos adicionales (opcional)</Label>
                    <p className="text-xs text-muted-foreground">
                        Soldadura y otros costos aplican sin importar si la pieza se corta, se ensambla, o
                        ninguna de las dos — se suman al costo de la pieza tal cual.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <div className="rounded-md border p-2">
                        <label htmlFor="weldingEnabled" className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                id="weldingEnabled"
                                checked={weldingEnabled}
                                onChange={(e) => {
                                    setWeldingEnabled(e.target.checked);
                                    if (!e.target.checked) setValue("weldingCost", undefined);
                                }}
                            />
                            <span className="text-sm font-medium">Soldadura</span>
                        </label>
                        {weldingEnabled && (
                            <Input
                                className="mt-2 w-24"
                                type="number"
                                step="0.01"
                                min={0}
                                placeholder="0"
                                {...register("weldingCost", {
                                    setValueAs: (v) => (v === "" ? undefined : Number(v))
                                })}
                            />
                        )}
                    </div>

                    <div className="rounded-md border p-2">
                        <label htmlFor="otherEnabled" className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                id="otherEnabled"
                                checked={otherEnabled}
                                onChange={(e) => {
                                    setOtherEnabled(e.target.checked);
                                    if (!e.target.checked) {
                                        setValue("otherCostAmount", undefined);
                                        setValue("otherCostDescription", "");
                                    }
                                }}
                            />
                            <span className="text-sm font-medium">Otro</span>
                        </label>
                        {otherEnabled && (
                            <div className="mt-2 flex gap-2">
                                <Input
                                    className="w-32"
                                    placeholder="Descripción"
                                    {...register("otherCostDescription", { onChange: uppercaseOnChange })}
                                />
                                <Input
                                    className="w-24"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    placeholder="0"
                                    {...register("otherCostAmount", {
                                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                                    })}
                                />
                            </div>
                        )}
                    </div>

                </div>

            </div>

            <div>
                <Label className="mb-1">Costo</Label>
                <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0"
                    {...register("cost", {
                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                    })}
                />
                {hasCuttingRecipe && (
                    <p className="text-sm text-muted-foreground">
                        Calculado automáticamente a partir de la receta de corte (materia prima, láser,
                        corte mecánico, doblez, curvado, soldadura y otros costos) — podés ajustarlo a mano si
                        hace falta.
                    </p>
                )}
                {!hasCuttingRecipe && (validComponents.length > 0 || weldingEnabled || otherEnabled) && (
                    <p className="text-sm text-muted-foreground">
                        Calculado automáticamente sumando el costo de los componentes de la receta de ensamblaje
                        (si tiene) más soldadura y otros costos (si aplican) — podés ajustarlo a mano si hace falta.
                    </p>
                )}
                <p className="text-sm text-red-500">{errors.cost?.message}</p>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}
