import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { marginProfileSchema } from "@/validators";
import type { MarginProfileFormData } from "@/validators";
import { useCreateMarginProfile, useUpdateMarginProfile, useMarginProfile } from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    profileId?: string;
};

export function MarginProfileForm({ onSuccess, mode = "create", profileId }: Props) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(marginProfileSchema),
        defaultValues: {
            name: "",
            percentage: 0,
            displayOrder: 1
        }
    });

    const createMutation = useCreateMarginProfile();
    const updateMutation = useUpdateMarginProfile();
    const { data: profileData } = useMarginProfile(mode === "edit" ? profileId : undefined);
    const loading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {

        if (mode !== "edit" || !profileData?.data) {
            return;
        }

        reset({
            name: profileData.data.name,
            percentage: Number(profileData.data.percentage),
            displayOrder: profileData.data.displayOrder
        });

    }, [mode, profileData, reset]);

    const onSubmit = (data: MarginProfileFormData) => {

        const payload = {
            name: data.name,
            percentage: data.percentage,
            displayOrder: data.displayOrder
        };

        const onError = (error: unknown) => {
            const message =
                axios.isAxiosError<{ message?: string }>(error) &&
                error.response?.data?.message
                    ? error.response.data.message
                    : "No se pudo guardar el perfil de margen.";
            toast.error(message);
        };

        if (mode === "edit" && profileId) {
            updateMutation.mutate({ id: profileId, data: payload }, {
                onSuccess: () => {
                    toast.success("Perfil de margen actualizado correctamente.");
                    onSuccess?.();
                },
                onError
            });
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Perfil de margen creado correctamente.");
                reset();
                onSuccess?.();
            },
            onError
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            <div>
                <Label className="mb-1">Nombre</Label>
                <Input placeholder="Ej: Precio 1" {...register("name")} />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Porcentaje de descuento</Label>
                <Input type="number" step="0.01" {...register("percentage")} />
                <p className="text-sm text-red-500">{errors.percentage?.message}</p>
            </div>

            <div>
                <Label className="mb-1">Orden de visualización</Label>
                <Input type="number" step="1" {...register("displayOrder")} />
                <p className="text-sm text-red-500">{errors.displayOrder?.message}</p>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}