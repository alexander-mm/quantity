import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { partSchema } from "@/validators";
import type { PartFormData } from "@/validators";
import { useCreatePart, useUpdatePart, usePart } from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    partId?: string;
};

export function PartForm({ onSuccess, mode = "create", partId }: Props) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(partSchema),
        defaultValues: {
            code: "",
            name: "",
            description: "",
            initialQuantity: 0
        }
    });

    const createMutation = useCreatePart();
    const updateMutation = useUpdatePart();
    const { data: partData } = usePart(mode === "edit" ? partId : undefined);
    const loading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {

        if (mode !== "edit" || !partData?.data) {
            return;
        }

        reset({
            code: partData.data.code,
            name: partData.data.name,
            description: partData.data.description ?? ""
        });

    }, [mode, partData, reset]);

    const onSubmit = (data: PartFormData) => {

        const payload = {
            code: data.code,
            name: data.name,
            description: data.description || undefined,
            ...(mode === "create" ? { initialQuantity: data.initialQuantity || undefined } : {})
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
                onSuccess: () => {
                    toast.success("Pieza actualizada correctamente.");
                    onSuccess?.();
                },
                onError
            });
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Pieza creada correctamente.");
                reset();
                onSuccess?.();
            },
            onError
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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

            {mode === "create" && (
                <div>
                    <Label className="mb-1">Cantidad a cargar (opcional)</Label>
                    <Input
                        type="number"
                        min={0}
                        step="1"
                        {...register("initialQuantity", { valueAsNumber: true })}
                    />
                    <p className="text-xs text-muted-foreground">
                        Si la pieza ya tiene unidades producidas, regístralas aquí para dejar la pieza creada
                        con su stock inicial en un solo paso. Déjalo en 0 si aún no hay producción.
                    </p>
                    <p className="text-sm text-red-500">{errors.initialQuantity?.message}</p>
                </div>
            )}

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}
