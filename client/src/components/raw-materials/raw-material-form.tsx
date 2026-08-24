import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { rawMaterialSchema } from "@/validators";
import type { RawMaterialFormData } from "@/validators";
import { useCreateRawMaterial, useUpdateRawMaterial, useRawMaterial, useRawMaterials } from "@/hooks";
import { getNextSequentialCode } from "@/lib";
import type { TubeProfile } from "@/types";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    rawMaterialId?: string;
};

function toOptionalNumber(value: string): number | undefined {
    return value === "" ? undefined : Number(value);
}

export function RawMaterialForm({ onSuccess, mode = "create", rawMaterialId }: Props) {

    const { register, control, handleSubmit, reset, setValue, setError, getValues, formState: { errors } } = useForm<RawMaterialFormData>({
        resolver: zodResolver(rawMaterialSchema),
        defaultValues: {
            code: "",
            name: "",
            shape: "SHEET",
            material: "",
            thickness: undefined,
            width: undefined,
            height: undefined,
            length: undefined,
            profile: undefined,
            minimumStock: undefined,
            initialQuantity: undefined,
            cost: undefined,
            wastePercentage: undefined,
            laserCostPerMeter: undefined,
            mechanicalCutCost: undefined,
            bendCostPerBend: undefined,
            curveCostPerCurve: undefined
        }
    });

    const shape = useWatch({ control, name: "shape" });
    const profile = useWatch({ control, name: "profile" });

    // El check de cada campo es un estado propio, independiente de si ya tiene un numero
    // cargado — asi al tildarlo el input queda vacio (solo el placeholder "0"), en vez de
    // forzar un valor. Se sincroniza contra los datos cargados durante el render (no en un
    // efecto) comparando el id, siguiendo el patron recomendado para "ajustar estado" de React.
    const [loadedRawMaterialId, setLoadedRawMaterialId] = useState<string | undefined>(undefined);
    const [costEnabled, setCostEnabled] = useState(false);
    const [wasteEnabled, setWasteEnabled] = useState(false);
    const [laserEnabled, setLaserEnabled] = useState(false);
    const [mechanicalEnabled, setMechanicalEnabled] = useState(false);
    const [bendEnabled, setBendEnabled] = useState(false);
    const [curveEnabled, setCurveEnabled] = useState(false);

    const createMutation = useCreateRawMaterial();
    const updateMutation = useUpdateRawMaterial();
    const { data: rawMaterialData } = useRawMaterial(mode === "edit" ? rawMaterialId : undefined);
    const { data: rawMaterialsData } = useRawMaterials();
    const loading = createMutation.isPending || updateMutation.isPending;

    if (rawMaterialData?.data && rawMaterialData.data.id !== loadedRawMaterialId) {
        const item = rawMaterialData.data;
        setLoadedRawMaterialId(item.id);
        setCostEnabled(item.cost !== null);
        setWasteEnabled(item.wastePercentage !== null);
        setLaserEnabled(item.laserCostPerMeter !== null);
        setMechanicalEnabled(item.mechanicalCutCost !== null);
        setBendEnabled(item.bendCostPerBend !== null);
        setCurveEnabled(item.curveCostPerCurve !== null);
    }

    const otherRawMaterials = (rawMaterialsData?.data ?? []).filter(item => item.id !== rawMaterialId);

    const lastAutoCodeRef = useRef<string | null>(null);

    useEffect(() => {

        // El codigo sigue una convencion por forma (TUB-/LAM-/VAR-), asi que el "ultimo"
        // debe buscarse dentro de la misma forma seleccionada, no en la lista completa.
        if (mode !== "create" || !rawMaterialsData?.data) {
            return;
        }

        const currentCode = getValues("code");

        if (currentCode && currentCode !== lastAutoCodeRef.current) {
            return;
        }

        const lastOfShape = rawMaterialsData.data.find(item => item.shape === shape);
        const nextCode = getNextSequentialCode(lastOfShape?.code);

        if (nextCode && nextCode !== currentCode) {
            setValue("code", nextCode);
            lastAutoCodeRef.current = nextCode;
        }

    }, [mode, rawMaterialsData, shape, getValues, setValue]);

    useEffect(() => {

        if (mode !== "edit" || !rawMaterialData?.data) {
            return;
        }

        const item = rawMaterialData.data;

        reset({
            code: item.code,
            name: item.name,
            shape: item.shape,
            material: item.material,
            thickness: Number(item.thickness),
            width: item.width !== null ? Number(item.width) : undefined,
            height: item.height !== null ? Number(item.height) : undefined,
            length: item.length !== null ? Number(item.length) : undefined,
            profile: item.profile ?? undefined,
            minimumStock: Number(item.minimumStock),
            cost: item.cost !== null ? Number(item.cost) : undefined,
            wastePercentage: item.wastePercentage !== null ? Number(item.wastePercentage) : undefined,
            laserCostPerMeter: item.laserCostPerMeter !== null ? Number(item.laserCostPerMeter) : undefined,
            mechanicalCutCost: item.mechanicalCutCost !== null ? Number(item.mechanicalCutCost) : undefined,
            bendCostPerBend: item.bendCostPerBend !== null ? Number(item.bendCostPerBend) : undefined,
            curveCostPerCurve: item.curveCostPerCurve !== null ? Number(item.curveCostPerCurve) : undefined
        });

    }, [mode, rawMaterialData, reset]);

    const onSubmit = (data: RawMaterialFormData) => {

        const normalizedName = data.name.trim().toLowerCase();
        const isDuplicateName = otherRawMaterials.some(
            item => item.name.trim().toLowerCase() === normalizedName
        );

        if (isDuplicateName) {
            setError("name", { message: "Ya existe una materia prima con este nombre." });
            return;
        }

        const payload = {
            code: data.code,
            name: data.name,
            shape: data.shape,
            material: data.material,
            thickness: Number(data.thickness),
            width: data.width !== undefined ? Number(data.width) : undefined,
            height: data.height !== undefined ? Number(data.height) : undefined,
            length: data.length !== undefined ? Number(data.length) : undefined,
            profile: (data.profile || undefined) as TubeProfile | undefined,
            minimumStock: Number(data.minimumStock) || 0,
            ...(mode === "create" ? { initialQuantity: Number(data.initialQuantity) || undefined } : {}),
            cost: costEnabled ? (Number(data.cost) || 0) : undefined,
            wastePercentage: wasteEnabled ? (Number(data.wastePercentage) || 0) : undefined,
            laserCostPerMeter: laserEnabled ? (Number(data.laserCostPerMeter) || 0) : undefined,
            mechanicalCutCost: mechanicalEnabled ? (Number(data.mechanicalCutCost) || 0) : undefined,
            bendCostPerBend: bendEnabled ? (Number(data.bendCostPerBend) || 0) : undefined,
            curveCostPerCurve: curveEnabled ? (Number(data.curveCostPerCurve) || 0) : undefined
        };

        const onError = (error: unknown) => {
            const message =
                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                    ? error.response.data.message
                    : "No se pudo guardar la materia prima.";
            toast.error(message);
        };

        if (mode === "edit" && rawMaterialId) {
            updateMutation.mutate({ id: rawMaterialId, data: payload }, {
                onSuccess: () => {
                    toast.success("Materia prima actualizada correctamente.");
                    onSuccess?.();
                },
                onError
            });
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Materia prima creada correctamente.");
                reset();
                onSuccess?.();
            },
            onError
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)} noValidate className="space-y-5">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

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
                    <Label className="mb-1">Forma</Label>
                    <Controller
                        control={control}
                        name="shape"
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value);

                                    setValue("profile", undefined);
                                    setValue("length", undefined);

                                    if (value === "SHEET") {
                                        setValue("width", 1220);
                                        setValue("height", 2440);
                                    } else {
                                        setValue("width", undefined);
                                        setValue("height", undefined);

                                        if (value === "TUBE") {
                                            setValue("length", 6);
                                        }
                                    }

                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione">
                                        {(value: string | null) => {
                                            if (value === "TUBE") return "Tubo";
                                            if (value === "ROD") return "Varilla";
                                            return "Lámina";
                                        }}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SHEET">Lámina</SelectItem>
                                    <SelectItem value="TUBE">Tubo</SelectItem>
                                    <SelectItem value="ROD">Varilla</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div>
                    <Label  className="mb-1">Material</Label>
                    <Input placeholder="Acero, aluminio, inoxidable..." {...register("material")} />
                    <p className="text-sm text-red-500">{errors.material?.message}</p>
                </div>

                <div>
                    <Label  className="mb-1">Calibre / espesor (mm)</Label>
                    <Input type="number" step="0.001" min={0} placeholder="1.4 - 2 - 3" {...register("thickness", { setValueAs: toOptionalNumber })} />
                    <p className="text-sm text-red-500">{errors.thickness?.message}</p>
                </div>

                {shape === "SHEET" && (
                    <>
                        <div>
                            <Label className="mb-1">Ancho de la lámina (mm)</Label>
                            <Input defaultValue="1220" type="number" step="1" min={0} {...register("width", { setValueAs: toOptionalNumber })} />
                            <p className="text-sm text-red-500">{errors.width?.message}</p>
                        </div>

                        <div>
                            <Label className="mb-1">Alto de la lámina (mm)</Label>
                            <Input defaultValue="2440" type="number" step="0.01" min={0} {...register("height", { setValueAs: toOptionalNumber })} />
                            <p className="text-sm text-red-500">{errors.height?.message}</p>
                        </div>
                    </>
                )}

                {shape === "TUBE" && (
                    <>
                        <div>
                            <Label className="mb-1">Perfil</Label>
                            <Controller
                                control={control}
                                name="profile"
                                render={({ field }) => (
                                    <Select
                                        value={field.value ?? ""}
                                        onValueChange={(value) => field.onChange(value || undefined)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccione un perfil">
                                                {(value: string | null) => {
                                                    if (value === "SQUARE") return "Cuadrado";
                                                    if (value === "RECTANGULAR") return "Rectangular";
                                                    if (value === "ROUND") return "Redondo";
                                                    return "Seleccione un perfil";
                                                }}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ROUND">Redondo</SelectItem>
                                            <SelectItem value="SQUARE">Cuadrado</SelectItem>
                                            <SelectItem value="RECTANGULAR">Rectangular</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <p className="text-sm text-red-500">{errors.profile?.message}</p>
                        </div>

                        <div>
                            <Label className="mb-1">Longitud del tubo (m)</Label>
                            <Input type="number" step="0.01" min={0} defaultValue="6" {...register("length", { setValueAs: toOptionalNumber })} />
                            <p className="text-sm text-red-500">{errors.length?.message}</p>
                        </div>

                        {profile === "ROUND" && (
                            <div>
                                <Label className="mb-1">Diámetro (pulgadas)</Label>
                                <Input type="number" step="0.01" min={0} placeholder="0" {...register("width", { setValueAs: toOptionalNumber })} />
                                <p className="text-sm text-red-500">{errors.width?.message}</p>
                            </div>
                        )}

                        {profile === "SQUARE" && (
                            <div>
                                <Label className="mb-1">Lado (mm)</Label>
                                <Input type="number" step="0.01" min={0} placeholder="0" {...register("width", { setValueAs: toOptionalNumber })} />
                                <p className="text-sm text-red-500">{errors.width?.message}</p>
                            </div>
                        )}

                        {profile === "RECTANGULAR" && (
                            <>
                                <div>
                                    <Label className="mb-1">Lado 1 (mm)</Label>
                                    <Input type="number" step="0.01" min={0} placeholder="0" {...register("width", { setValueAs: toOptionalNumber })} />
                                    <p className="text-sm text-red-500">{errors.width?.message}</p>
                                </div>

                                <div>
                                    <Label className="mb-1">Lado 2 (mm)</Label>
                                    <Input type="number" step="0.01" min={0} placeholder="0" {...register("height", { setValueAs: toOptionalNumber })} />
                                    <p className="text-sm text-red-500">{errors.height?.message}</p>
                                </div>
                            </>
                        )}
                    </>
                )}

                {shape === "ROD" && (
                    <div>
                        <Label className="mb-1">Longitud de la varilla (m)</Label>
                        <Input type="number" step="0.01" min={0} placeholder="0" {...register("length", { setValueAs: toOptionalNumber })} />
                        <p className="text-sm text-red-500">{errors.length?.message}</p>
                    </div>
                )}

                <div>
                    <Label className="mb-1">Stock mínimo</Label>
                    <Input type="number" min={0} step="1" placeholder="0" {...register("minimumStock", { setValueAs: toOptionalNumber })} />
                    <p className="text-xs text-muted-foreground">
                        Cuando la existencia llegue a este nivel o por debajo, se marcará como stock bajo.
                    </p>
                    <p className="text-sm text-red-500">{errors.minimumStock?.message}</p>
                </div>

                {mode === "create" && (
                    <div>
                        <Label className="mb-1">Cantidad a cargar (opcional)</Label>
                        <Input type="number" min={0} step="1" placeholder="0" {...register("initialQuantity", { setValueAs: toOptionalNumber })} />
                        <p className="text-sm text-red-500">{errors.initialQuantity?.message}</p>
                    </div>
                )}

            </div>

            <div className="space-y-3 rounded-lg border p-3">

                <div>
                    <Label className="mb-1">Costeo de producción (opcional)</Label>
                    <p className="text-xs text-muted-foreground">
                        Marca solo lo que aplica a esta materia prima. Estos valores son la única fuente de
                        verdad: cambiarlos aquí recalcula sola cualquier pieza que se corte de esta materia prima.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <div className="rounded-md border p-2">
                        <label htmlFor="costEnabled" className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                id="costEnabled"
                                checked={costEnabled}
                                onChange={(e) => {
                                    setCostEnabled(e.target.checked);
                                    if (!e.target.checked) setValue("cost", undefined);
                                }}
                            />
                            <span className="text-sm font-medium">Costo</span>
                        </label>
                        {costEnabled && (
                            <>
                                <Input
                                    className="mt-2 w-24"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    placeholder="0"
                                    {...register("cost", { setValueAs: toOptionalNumber })}
                                />
                                <p className="text-sm text-red-500">{errors.cost?.message}</p>
                            </>
                        )}
                    </div>

                    <div className="rounded-md border p-2">
                        <label htmlFor="wasteEnabled" className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                id="wasteEnabled"
                                checked={wasteEnabled}
                                onChange={(e) => {
                                    setWasteEnabled(e.target.checked);
                                    if (!e.target.checked) setValue("wastePercentage", undefined);
                                }}
                            />
                            <span className="text-sm font-medium">% de daño o pérdida</span>
                        </label>
                        {wasteEnabled && (
                            <>
                                <Input
                                    className="mt-2 w-24"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    max={100}
                                    placeholder="0"
                                    {...register("wastePercentage", { setValueAs: toOptionalNumber })}
                                />
                                <p className="text-sm text-red-500">{errors.wastePercentage?.message}</p>
                            </>
                        )}
                    </div>

                    <div className="rounded-md border p-2">
                        <label htmlFor="laserEnabled" className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                id="laserEnabled"
                                checked={laserEnabled}
                                onChange={(e) => {
                                    setLaserEnabled(e.target.checked);
                                    if (!e.target.checked) setValue("laserCostPerMeter", undefined);
                                }}
                            />
                            <span className="text-sm font-medium">Costo de corte láser ($/metro)</span>
                        </label>
                        {laserEnabled && (
                            <>
                                <Input
                                    className="mt-2 w-24"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    placeholder="0"
                                    {...register("laserCostPerMeter", { setValueAs: toOptionalNumber })}
                                />
                                <p className="text-sm text-red-500">{errors.laserCostPerMeter?.message}</p>
                            </>
                        )}
                    </div>

                    <div className="rounded-md border p-2">
                        <label htmlFor="mechanicalEnabled" className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                id="mechanicalEnabled"
                                checked={mechanicalEnabled}
                                onChange={(e) => {
                                    setMechanicalEnabled(e.target.checked);
                                    if (!e.target.checked) setValue("mechanicalCutCost", undefined);
                                }}
                            />
                            <span className="text-sm font-medium">Costo de corte mecánico (monto fijo)</span>
                        </label>
                        {mechanicalEnabled && (
                            <>
                                <Input
                                    className="mt-2 w-24"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    placeholder="0"
                                    {...register("mechanicalCutCost", { setValueAs: toOptionalNumber })}
                                />
                                <p className="text-sm text-red-500">{errors.mechanicalCutCost?.message}</p>
                            </>
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
                                    if (!e.target.checked) setValue("bendCostPerBend", undefined);
                                }}
                            />
                            <span className="text-sm font-medium">Costo de doblez mecánico ($/doblez)</span>
                        </label>
                        {bendEnabled && (
                            <>
                                <Input
                                    className="mt-2 w-24"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    placeholder="0"
                                    {...register("bendCostPerBend", { setValueAs: toOptionalNumber })}
                                />
                                <p className="text-sm text-red-500">{errors.bendCostPerBend?.message}</p>
                            </>
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
                                    if (!e.target.checked) setValue("curveCostPerCurve", undefined);
                                }}
                            />
                            <span className="text-sm font-medium">Costo de curvado ($/curva)</span>
                        </label>
                        {curveEnabled && (
                            <>
                                <Input
                                    className="mt-2 w-24"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    placeholder="0"
                                    {...register("curveCostPerCurve", { setValueAs: toOptionalNumber })}
                                />
                                <p className="text-sm text-red-500">{errors.curveCostPerCurve?.message}</p>
                            </>
                        )}
                    </div>

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
