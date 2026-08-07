import { useEffect } from "react";
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
import { useCreateRawMaterial, useUpdateRawMaterial, useRawMaterial } from "@/hooks";
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

    const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<RawMaterialFormData>({
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
            initialQuantity: undefined
        }
    });

    const shape = useWatch({ control, name: "shape" });
    const profile = useWatch({ control, name: "profile" });

    const createMutation = useCreateRawMaterial();
    const updateMutation = useUpdateRawMaterial();
    const { data: rawMaterialData } = useRawMaterial(mode === "edit" ? rawMaterialId : undefined);
    const loading = createMutation.isPending || updateMutation.isPending;

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
            profile: item.profile ?? undefined
        });

    }, [mode, rawMaterialData, reset]);

    const onSubmit = (data: RawMaterialFormData) => {

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
            ...(mode === "create" ? { initialQuantity: Number(data.initialQuantity) || undefined } : {})
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

                                    if (value === "SHEET") {
                                        setValue("width", 1220);
                                        setValue("height", 2440);
                                        setValue("length", undefined);
                                        setValue("profile", undefined);
                                    } else {
                                        setValue("width", undefined);
                                        setValue("height", undefined);
                                    }

                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SHEET">Lámina</SelectItem>
                                    <SelectItem value="TUBE">Tubo</SelectItem>
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
                                            <SelectValue placeholder="Seleccione un perfil" />
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
                            <Label className="mb-1">Longitud del tubo (mm)</Label>
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

                {mode === "create" && (
                    <div>
                        <Label className="mb-1">Cantidad a cargar (opcional)</Label>
                        <Input type="number" min={0} step="1" placeholder="0" {...register("initialQuantity", { setValueAs: toOptionalNumber })} />
                        <p className="text-sm text-red-500">{errors.initialQuantity?.message}</p>
                    </div>
                )}

            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}
