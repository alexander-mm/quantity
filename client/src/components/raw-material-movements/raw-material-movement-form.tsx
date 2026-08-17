import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { rawMaterialMovementSchema } from "@/validators";
import type { RawMaterialMovementFormData } from "@/validators";
import { getNextSequentialCode, todayLocalDateString } from "@/lib";

import { useCreateRawMaterialMovement, useRawMaterialMovements } from "@/hooks";
import { RawMaterialMovementHeader } from "./raw-material-movement-header";
import { RawMaterialMovementDetailsTable } from "./raw-material-movement-details-table";

type Props = {
    onSuccess?: () => void;
};

export function RawMaterialMovementForm({ onSuccess }: Props) {

    const methods = useForm<RawMaterialMovementFormData>({
        resolver: zodResolver(rawMaterialMovementSchema),
        defaultValues: {
            number: "",
            type: "IN",
            movementDate: todayLocalDateString(),
            observations: "",
            details: []
        }
    });

    const { setValue, getValues } = methods;

    const createMutation = useCreateRawMaterialMovement();
    const { data: rawMaterialMovementsData } = useRawMaterialMovements();
    const loading = createMutation.isPending;

    useEffect(() => {

        if (!rawMaterialMovementsData?.data || getValues("number")) {
            return;
        }

        const [lastMovement] = [...rawMaterialMovementsData.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const nextNumber = getNextSequentialCode(lastMovement?.number);

        if (nextNumber) {
            setValue("number", nextNumber);
        }

    }, [rawMaterialMovementsData, getValues, setValue]);

    const onSubmit = (data: RawMaterialMovementFormData) => {

        createMutation.mutate({
            ...data,
            movementDate: new Date(data.movementDate)
        }, {
            onSuccess: () => {
                toast.success("Movimiento registrado correctamente.");
                methods.reset();
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo registrar el movimiento.";
                toast.error(message);
            }
        });

    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit, onFormError)} noValidate className="space-y-6 min-w-0">

                <RawMaterialMovementHeader />

                <RawMaterialMovementDetailsTable />

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar movimiento"}
                    </Button>
                </div>

            </form>
        </FormProvider>
    );

}
