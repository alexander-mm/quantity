import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { clientSchema } from "@/validators";
import type { ClientFormData } from "@/validators";
import { useCreateClient, useUpdateClient, useClient } from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    clientId?: string;
};

export function ClientForm({ onSuccess, mode = "create", clientId }: Props) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            document: "",
            firstName: "",
            lastName: "",
            companyName: "",
            phone: "",
            email: "",
            address: "",
            discountPercentage: 0
        }
    });

    const createMutation = useCreateClient();
    const updateMutation = useUpdateClient();
    const { data: clientData } = useClient(mode === "edit" ? clientId : undefined);
    const loading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {

        if (mode !== "edit" || !clientData?.data) {
            return;
        }

        reset({
            document: clientData.data.document,
            firstName: clientData.data.firstName ?? "",
            lastName: clientData.data.lastName ?? "",
            companyName: clientData.data.companyName ?? "",
            phone: clientData.data.phone ?? "",
            email: clientData.data.email ?? "",
            address: clientData.data.address ?? "",
            discountPercentage: clientData.data.discountPercentage
                ? Number(clientData.data.discountPercentage)
                : 0
        });

    }, [mode, clientData, reset]);

    const onSubmit = (data: ClientFormData) => {

        const payload = {
            document: data.document,
            firstName: data.firstName || undefined,
            lastName: data.lastName || undefined,
            companyName: data.companyName || undefined,
            phone: data.phone || undefined,
            email: data.email || undefined,
            address: data.address || undefined,
            discountPercentage: data.discountPercentage || undefined
        };

        const onError = (error: unknown) => {
            const message =
                axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                    ? error.response.data.message
                    : "No se pudo guardar el cliente.";
            toast.error(message);
        };

        if (mode === "edit" && clientId) {
            updateMutation.mutate({ id: clientId, data: payload }, {
                onSuccess: () => {
                    toast.success("Cliente actualizado correctamente.");
                    onSuccess?.();
                },
                onError
            });
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Cliente creado correctamente.");
                reset();
                onSuccess?.();
            },
            onError
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
                <Label>Documento</Label>
                <Input {...register("document")} />
                <p className="text-sm text-red-500">{errors.document?.message}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label>Nombre</Label>
                    <Input {...register("firstName")} />
                    <p className="text-sm text-red-500">{errors.firstName?.message}</p>
                </div>
                <div>
                    <Label>Apellido</Label>
                    <Input {...register("lastName")} />
                    <p className="text-sm text-red-500">{errors.lastName?.message}</p>
                </div>
            </div>

            <div>
                <Label>Empresa (opcional)</Label>
                <Input {...register("companyName")} />
                <p className="text-sm text-red-500">{errors.companyName?.message}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label>Teléfono (opcional)</Label>
                    <Input {...register("phone")} />
                </div>
                <div>
                    <Label>Correo (opcional)</Label>
                    <Input {...register("email")} />
                    <p className="text-sm text-red-500">{errors.email?.message}</p>
                </div>
            </div>

            <div>
                <Label>Dirección (opcional)</Label>
                <Input {...register("address")} />
            </div>

            <div>
                <Label>Descuento del cliente (%)</Label>
                <Input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    {...register("discountPercentage", { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                    Si se define, en Ventas no se aplicará ningún perfil de margen a este cliente — en su lugar,
                    se descuenta automáticamente este porcentaje sobre el total.
                </p>
                <p className="text-sm text-red-500">{errors.discountPercentage?.message}</p>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </div>

        </form>
    );

}
