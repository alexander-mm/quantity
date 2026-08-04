import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { partMovementSchema } from "@/validators";
import type { PartMovementFormData } from "@/validators";

import { useCreatePartMovement } from "@/hooks";
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

    const createMutation = useCreatePartMovement();
    const loading = createMutation.isPending;

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
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 min-w-0">

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
