import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { partMovementSchema } from "@/validators";
import type { PartMovementFormData } from "@/validators";
import { getNextSequentialCode } from "@/lib";

import { useCreatePartMovement, usePartMovements } from "@/hooks";
import { PartMovementHeader } from "./part-movement-header";
import { PartMovementDetailsTable } from "./part-movement-details-table";

type Props = {
    onSuccess?: () => void;
};

export function PartMovementForm({ onSuccess }: Props) {

    const methods = useForm<PartMovementFormData>({
        resolver: zodResolver(partMovementSchema),
        defaultValues: {
            number: "",
            type: "IN",
            movementDate: new Date().toISOString().split("T")[0],
            observations: "",
            details: []
        }
    });

    const { setValue, getValues } = methods;

    const createMutation = useCreatePartMovement();
    const { data: partMovementsData } = usePartMovements();
    const loading = createMutation.isPending;

    useEffect(() => {

        if (!partMovementsData?.data || getValues("number")) {
            return;
        }

        const [lastMovement] = [...partMovementsData.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const nextNumber = getNextSequentialCode(lastMovement?.number);

        if (nextNumber) {
            setValue("number", nextNumber);
        }

    }, [partMovementsData, getValues, setValue]);

    const onSubmit = (data: PartMovementFormData) => {

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
            <form onSubmit={methods.handleSubmit(onSubmit, onFormError)} className="space-y-6 min-w-0">

                <PartMovementHeader />

                <PartMovementDetailsTable />

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar movimiento"}
                    </Button>
                </div>

            </form>
        </FormProvider>
    );

}
