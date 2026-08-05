import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    supplierSchema,
    type SupplierFormData
} from "@/validators";

import {
    useCreateSupplier,
    useSupplier,
    useUpdateSupplier
} from "@/hooks";

import { toast } from "react-hot-toast";

type SupplierFormProps = {
    onSuccess?: () => void;
    mode?: "create" | "edit";
    supplierId?: string;
};

export function SupplierForm({

    onSuccess,
    mode = "create",
    supplierId

}: SupplierFormProps) {

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors
        }
    } = useForm<SupplierFormData>({

        resolver: zodResolver(
            supplierSchema
        ),

        defaultValues: {
            code: "",
            companyName: "",
            contactName: "",
            taxId: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            observations: ""
        }
    });

    const createSupplierMutation = useCreateSupplier();
    const updateSupplierMutation = useUpdateSupplier();
    const { data: supplierData } = useSupplier(
        supplierId
    );

    useEffect(() => {
        if (
            mode !== "edit" ||
            !supplierData?.data
        ) {
            return;
        }

        reset({

            code: supplierData.data.code,
            companyName:
                supplierData.data.companyName,
            contactName:
                supplierData.data.contactName ?? "",
            taxId:
                supplierData.data.taxId ?? "",
            phone:
                supplierData.data.phone ?? "",
            email:
                supplierData.data.email ?? "",
            address:
                supplierData.data.address ?? "",
            city:
                supplierData.data.city ?? "",
            observations:
                supplierData.data.observations ?? ""
        });
    }, [

        mode,
        supplierData,
        reset
    ]);

    function onSubmit(
        data: SupplierFormData
    ) {
        if (mode === "create") {
            createSupplierMutation.mutate(
                data,
                {
                    onSuccess: () => {
                        toast.success(
                            "Proveedor creado correctamente."
                        );
                        reset();
                        onSuccess?.();
                    },

                    onError: () => {
                        toast.error(
                            "No se pudo crear el proveedor."
                        );
                    }
                }
            );
            return;
        }

        if (!supplierId) {
            toast.error(
                "Proveedor no encontrado."
            );
            return;
        }

        updateSupplierMutation.mutate({
            id: supplierId,
            data
        }, {

            onSuccess: () => {
                toast.success(
                    "Proveedor actualizado correctamente."
                );
                reset();
                onSuccess?.();
            },

            onError: () => {
                toast.error(
                    "No se pudo actualizar el proveedor."
                );
            }
        });
    }

    return (

        <form onSubmit={handleSubmit( onSubmit )}className="space-y-6">
            <div>
                <Label className="mb-1">
                    Código
                </Label>

                <Input
                    {...register("code")}
                />
                <p className="text-sm text-red-500">
                    {errors.code?.message}
                </p>
            </div>

            <div>
                <Label className="mb-1">
                    Razón social
                </Label>
                <Input
                    {...register("companyName")}
                />
                <p className="text-sm text-red-500">
                    {errors.companyName?.message}
                </p>
            </div>

            <div>
                <Label className="mb-1">
                    Contacto
                </Label>
                <Input
                    {...register("contactName")}
                />
            </div>

            <div>
                <Label className="mb-1">
                    RUC/CC
                </Label>
                <Input
                    {...register("taxId")}
                />
            </div>

            <div>
                <Label className="mb-1">
                    Teléfono
                </Label>
                <Input
                    {...register("phone")}
                />
            </div>

            <div>
                <Label className="mb-1">
                    Correo
                </Label>
                <Input
                    {...register("email")}
                />
                <p className="text-sm text-red-500">
                    {errors.email?.message}
                </p>
            </div>

            <div>
                <Label className="mb-1">
                    Dirección
                </Label>
                <Input
                    {...register("address")}
                />
            </div>

            <div>
                <Label className="mb-1">
                    Ciudad
                </Label>
                <Input
                    {...register("city")}
                />
            </div>

            <div>
                <Label className="mb-1">
                    Observaciones
                </Label>
                <Input
                    {...register("observations")}
                />
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