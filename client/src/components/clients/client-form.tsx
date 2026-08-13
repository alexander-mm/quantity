import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clientSchema } from "@/validators";
import type { ClientFormData } from "@/validators";
import { useCreateClient, useUpdateClient, useClient } from "@/hooks";

type Props = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    clientId?: string;
};

export function ClientForm({ onSuccess, mode = "create", clientId }: Props) {

    const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            document: "",
            firstName: "",
            lastName: "",
            companyName: "",
            phone: "",
            email: "",
            address: "",
            discountPercentage: undefined,
            isWholesaler: false,
            usesCredit: false,
            currency: undefined
        }
    });

    const isWholesaler = useWatch({ control, name: "isWholesaler" });

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
                : 0,
            isWholesaler: clientData.data.isWholesaler,
            usesCredit: clientData.data.usesCredit,
            currency: clientData.data.currency ?? undefined
        });

    }, [mode, clientData, reset]);

    useEffect(() => {

        if (isWholesaler) {
            return;
        }

        setValue("usesCredit", false);
        setValue("currency", undefined);
        setValue("discountPercentage", 0);

    }, [isWholesaler, setValue]);

    const onSubmit = (data: ClientFormData) => {

        const payload = {
            document: data.document,
            firstName: data.firstName || undefined,
            lastName: data.lastName || undefined,
            companyName: data.companyName || undefined,
            phone: data.phone || undefined,
            email: data.email || undefined,
            address: data.address || undefined,
            discountPercentage: data.isWholesaler ? (Number(data.discountPercentage) || undefined) : undefined,
            isWholesaler: data.isWholesaler,
            usesCredit: data.isWholesaler ? data.usesCredit : false,
            currency: data.isWholesaler ? data.currency : undefined
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
        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-5">

            <div>
                <Label className="mb-1">Documento</Label>
                <Input {...register("document")} />
                <p className="text-sm text-red-500">{errors.document?.message}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label className="mb-1">Nombre</Label>
                    <Input {...register("firstName")} />
                    <p className="text-sm text-red-500">{errors.firstName?.message}</p>
                </div>
                <div>
                    <Label className="mb-1">Apellido</Label>
                    <Input {...register("lastName")} />
                    <p className="text-sm text-red-500">{errors.lastName?.message}</p>
                </div>
            </div>

            <div>
                <Label className="mb-1">Empresa (opcional)</Label>
                <Input {...register("companyName")} />
                <p className="text-sm text-red-500">{errors.companyName?.message}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label className="mb-1">Teléfono (opcional)</Label>
                    <Input {...register("phone")} />
                </div>
                <div>
                    <Label className="mb-1">Correo (opcional)</Label>
                    <Input {...register("email")} />
                    <p className="text-sm text-red-500">{errors.email?.message}</p>
                </div>
            </div>

            <div>
                <Label className="mb-1">Dirección (opcional)</Label>
                <Input {...register("address")} />
            </div>

            <div className="space-y-4 rounded-lg border p-3">

                <label className="flex items-center gap-2">
                    <input type="checkbox" {...register("isWholesaler")} />
                    <span className="font-medium">Es mayorista</span>
                </label>
                <p className="text-xs text-muted-foreground">
                    Si no es mayorista, el cliente queda como Cliente Final: no maneja % propio ni crédito, y en
                    Ventas se le aplican los perfiles de margen normales.
                </p>

                {isWholesaler && (
                    <div className="space-y-4 border-t pt-4">

                        <label className="flex items-center gap-2">
                            <input type="checkbox" {...register("usesCredit")} />
                            <span>Maneja crédito (cuentas de cobro)</span>
                        </label>

                        <div>
                            <Label className="mb-1">Moneda del mayorista</Label>
                            <Controller
                                control={control}
                                name="currency"
                                render={({ field }) => (
                                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="COP">COP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <p className="text-sm text-red-500">{errors.currency?.message}</p>
                        </div>

                        <div>
                            <Label className="mb-1">% de descuento propio</Label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                step="0.01"
                                placeholder="0"
                                {...register("discountPercentage", {
                                    setValueAs: (v) => (v === "" ? undefined : Number(v))
                                })}
                            />
                            <p className="text-xs text-muted-foreground">
                                En Ventas no se aplicará ningún perfil de margen a este cliente — en su lugar, se
                                descuenta automáticamente este porcentaje sobre el total.
                            </p>
                            <p className="text-sm text-red-500">{errors.discountPercentage?.message}</p>
                        </div>

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
