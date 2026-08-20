import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import { partRecipeSchema } from "@/validators";
import type { PartRecipeFormData } from "@/validators";
import { useRawMaterials } from "@/hooks";
import { usePartRecipe, useSetPartRecipe } from "@/hooks";
import type { Part, RawMaterialShape } from "@/types";

const RAW_MATERIAL_SHAPE_LABELS: Record<RawMaterialShape, string> = {
    SHEET: "lámina",
    TUBE: "tubo",
    ROD: "varilla"
};

type Props = {
    part: Part;
    onSuccess?: () => void;
};

export function PartRecipeForm({ part, onSuccess }: Props) {

    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PartRecipeFormData>({
        resolver: zodResolver(partRecipeSchema),
        defaultValues: {
            rawMaterialId: "",
            rawMaterialShape: undefined,
            pieceWidth: undefined,
            pieceHeight: undefined,
            pieceLength: undefined
        }
    });

    const rawMaterialId = useWatch({ control, name: "rawMaterialId" });
    const rawMaterialShape = useWatch({ control, name: "rawMaterialShape" });

    const { data: rawMaterialsData } = useRawMaterials();
    const rawMaterials = useMemo(() => rawMaterialsData?.data ?? [], [rawMaterialsData]);

    const { data: recipeData } = usePartRecipe(part.id);
    const setRecipeMutation = useSetPartRecipe();
    const loading = setRecipeMutation.isPending;

    useEffect(() => {

        const recipe = recipeData?.data;

        if (!recipe) {
            return;
        }

        reset({
            rawMaterialId: recipe.rawMaterialId,
            rawMaterialShape: recipe.rawMaterial.shape,
            pieceWidth: recipe.pieceWidth !== null ? Number(recipe.pieceWidth) : undefined,
            pieceHeight: recipe.pieceHeight !== null ? Number(recipe.pieceHeight) : undefined,
            pieceLength: recipe.pieceLength !== null ? Number(recipe.pieceLength) : undefined
        });

    }, [recipeData, reset]);

    useEffect(() => {

        const selected = rawMaterials.find(item => item.id === rawMaterialId);

        if (selected) {
            setValue("rawMaterialShape", selected.shape);
        }

    }, [rawMaterialId, rawMaterials, setValue]);

    const onSubmit = (data: PartRecipeFormData) => {

        const recipe = recipeData?.data;

        const payload = {
            rawMaterialId: data.rawMaterialId,
            pieceWidth: data.pieceWidth !== undefined ? Number(data.pieceWidth) : undefined,
            pieceHeight: data.pieceHeight !== undefined ? Number(data.pieceHeight) : undefined,
            pieceLength: data.pieceLength !== undefined ? Number(data.pieceLength) : undefined,
            // Este formulario no administra piezas por unidad ni el costeo de operaciones —
            // se editan en Piezas y no se reenvían acá (el servidor preserva lo existente
            // cuando piecesPerUnit se omite; el resto se reenvía tal cual para no perderlo).
            laserMeters: recipe?.laserMeters !== null && recipe?.laserMeters !== undefined ? Number(recipe.laserMeters) : undefined,
            usesMechanicalCut: recipe?.usesMechanicalCut ?? false,
            bendCount: recipe?.bendCount !== null && recipe?.bendCount !== undefined ? Number(recipe.bendCount) : undefined,
            curveCount: recipe?.curveCount !== null && recipe?.curveCount !== undefined ? Number(recipe.curveCount) : undefined
        };

        setRecipeMutation.mutate({ partId: part.id, data: payload }, {
            onSuccess: () => {
                toast.success("Receta de corte guardada correctamente.");
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo guardar la receta de corte.";
                toast.error(message);
            }
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)} noValidate className="space-y-5">

            <div>
                <p className="text-sm text-muted-foreground">Pieza</p>
                <p className="font-medium">{part.code} - {part.name}</p>
            </div>

            <div>
                <Label className="mb-1">Materia prima de origen</Label>
                <Controller
                    control={control}
                    name="rawMaterialId"
                    render={({ field }) => {

                        const items = rawMaterials.map(item => ({
                            value: item.id,
                            label: `${item.code} - ${item.name} (${RAW_MATERIAL_SHAPE_LABELS[item.shape]})`
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
                                <ComboboxEmpty>
                                    No se encontraron materias primas.
                                </ComboboxEmpty>
                            </Combobox>
                        );

                    }}
                />
                <p className="text-sm text-red-500">{errors.rawMaterialId?.message}</p>
            </div>

            {rawMaterialShape === "SHEET" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label>Ancho de la pieza (cm, opcional)</Label>
                        <Input type="number" step="0.01" min={0} placeholder="0" {...register("pieceWidth", {
                            setValueAs: (v) => (v === "" ? undefined : Number(v))
                        })} />
                        <p className="text-sm text-red-500">{errors.pieceWidth?.message}</p>
                    </div>
                    <div>
                        <Label>Alto de la pieza (cm, opcional)</Label>
                        <Input type="number" step="0.01" min={0} placeholder="0" {...register("pieceHeight", {
                            setValueAs: (v) => (v === "" ? undefined : Number(v))
                        })} />
                        <p className="text-sm text-red-500">{errors.pieceHeight?.message}</p>
                    </div>
                </div>
            )}

            {(rawMaterialShape === "TUBE" || rawMaterialShape === "ROD") && (
                <div>
                    <Label>Longitud de la pieza (cm, opcional)</Label>
                    <Input type="number" step="0.01" min={0} placeholder="0" {...register("pieceLength", {
                        setValueAs: (v) => (v === "" ? undefined : Number(v))
                    })} />
                    <p className="text-sm text-red-500">{errors.pieceLength?.message}</p>
                </div>
            )}

            <div className="rounded-md border p-2">
                <p className="text-sm text-muted-foreground">Piezas por unidad de materia prima</p>
                <p className="font-medium">
                    {recipeData?.data?.piecesPerUnit !== null && recipeData?.data?.piecesPerUnit !== undefined
                        ? Number(recipeData.data.piecesPerUnit)
                        : "Sin definir"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Se carga en la ficha de la pieza, en "Piezas" — ahí también se define el costeo (láser, corte
                    mecánico, dobleces, curvas, soldadura, otros).
                </p>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar receta"}
                </Button>
            </div>

        </form>
    );

}
