import { FormProvider, useForm } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { stockTransferSchema } from "@/validators";
import type { StockTransferFormData } from "@/validators";
import { useCreateStockTransfer, useAuth } from "@/hooks";
import { StockTransferHeader } from "./stock-transfer-header";
import { StockTransferDetailsTable } from "./stock-transfer-details-table";
import { ROLES } from "@/constants/roles";

type Props = { onSuccess?: () => void; };

export function StockTransferForm({ onSuccess }: Props) {

    const { user } = useAuth();
    const isAdmin = user?.roleName === ROLES.ADMIN;

    const methods = useForm<StockTransferFormData>({
        resolver: zodResolver(stockTransferSchema),
        defaultValues: {
            number: "",
            originStoreId: isAdmin ? "" : (user?.storeId ?? ""),
            destType: "STORE",
            destStoreId: "",
            destUserId: "",
            dispatchDate: new Date().toISOString().split("T")[0],
            observations: "",
            details: []
        }

    });

    const createMutation = useCreateStockTransfer();

    const onSubmit = (data: StockTransferFormData) => {

        createMutation.mutate(data, {
            onSuccess: () => {
                toast.success("Envío despachado correctamente.");
                methods.reset();
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo despachar el envío.";
                toast.error(message);
            }
        });

    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit, onFormError)} className="space-y-6 min-w-0">
                <StockTransferHeader />
                <StockTransferDetailsTable />
                <div className="flex justify-end">
                    <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Despachando..." : "Despachar envío"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
