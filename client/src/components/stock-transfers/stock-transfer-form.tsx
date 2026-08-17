import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { stockTransferSchema } from "@/validators";
import type { StockTransferFormData } from "@/validators";
import {
    useCreateStockTransfer,
    useUpdateStockTransfer,
    useDispatchStockTransfer,
    useAuth,
    useStockTransfers
} from "@/hooks";
import { getNextSequentialCode, todayLocalDateString } from "@/lib";
import { StockTransferHeader } from "./stock-transfer-header";
import { StockTransferDetailsTable } from "./stock-transfer-details-table";
import { ROLES } from "@/constants/roles";
import type { StockTransfer } from "@/types";

type Props = { transfer?: StockTransfer | null; onSuccess?: () => void; };

function toFormData(transfer: StockTransfer): StockTransferFormData {
    return {
        number: transfer.number,
        originStoreId: transfer.originStore.id,
        destType: transfer.destType,
        destStoreId: transfer.destStore?.id ?? "",
        destUserId: transfer.destUser?.id ?? "",
        dispatchDate: transfer.dispatchDate.split("T")[0],
        observations: transfer.observations ?? "",
        details: transfer.details.map(d => ({
            productId: d.product.id,
            quantitySent: Number(d.quantitySent)
        }))
    };
}

export function StockTransferForm({ transfer, onSuccess }: Props) {

    const isEditing = !!transfer;

    const { user } = useAuth();
    const isAdmin = user?.roleName === ROLES.ADMIN;

    const methods = useForm<StockTransferFormData>({
        resolver: zodResolver(stockTransferSchema),
        defaultValues: transfer ? toFormData(transfer) : {
            number: "",
            originStoreId: isAdmin ? "" : (user?.storeId ?? ""),
            destType: "STORE",
            destStoreId: "",
            destUserId: "",
            dispatchDate: todayLocalDateString(),
            observations: "",
            details: []
        }

    });

    const createMutation = useCreateStockTransfer();
    const updateMutation = useUpdateStockTransfer();
    const dispatchMutation = useDispatchStockTransfer();
    const { data: transfersData } = useStockTransfers();

    useEffect(() => {

        if (isEditing || !transfersData?.data || methods.getValues("number")) {
            return;
        }

        const [lastTransfer] = [...transfersData.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const nextNumber = getNextSequentialCode(lastTransfer?.number);

        if (nextNumber) {
            methods.setValue("number", nextNumber);
        }

    }, [transfersData, methods, isEditing]);

    const isSaving = createMutation.isPending || updateMutation.isPending;

    const onSubmit = (data: StockTransferFormData) => {

        if (isEditing) {

            updateMutation.mutate({ id: transfer.id, data }, {
                onSuccess: () => {
                    toast.success("Envío actualizado correctamente.");
                    onSuccess?.();
                },
                onError: (error) => {
                    const message =
                        axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                            ? error.response.data.message
                            : "No se pudo actualizar el envío.";
                    toast.error(message);
                }
            });

            return;

        }

        createMutation.mutate(data, {
            onSuccess: () => {
                toast.success("Envío guardado como borrador.");
                methods.reset();
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo guardar el envío.";
                toast.error(message);
            }
        });

    };

    const handleDispatch = (data: StockTransferFormData) => {

        if (!transfer) return;

        // Guarda cualquier cambio pendiente en el formulario antes de despachar,
        // para no despachar una version vieja si el usuario edito y no le dio
        // "Guardar cambios" primero.
        updateMutation.mutate({ id: transfer.id, data }, {
            onSuccess: () => {

                dispatchMutation.mutate(transfer.id, {
                    onSuccess: () => {
                        toast.success("Envío despachado correctamente.");
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

            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo guardar el envío antes de despacharlo.";
                toast.error(message);
            }
        });

    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit, onFormError)} className="space-y-6 min-w-0">
                <StockTransferHeader />
                <StockTransferDetailsTable />
                <div className="flex justify-end gap-3">
                    <Button type="submit" variant={isEditing ? "outline" : "default"} disabled={isSaving}>
                        {isSaving
                            ? "Guardando..."
                            : isEditing ? "Guardar cambios" : "Guardar borrador"}
                    </Button>
                    {isEditing && (
                        <Button
                            type="button"
                            onClick={methods.handleSubmit(handleDispatch, onFormError)}
                            disabled={updateMutation.isPending || dispatchMutation.isPending}
                        >
                            {updateMutation.isPending || dispatchMutation.isPending
                                ? "Despachando..."
                                : "Confirmar despacho"}
                        </Button>
                    )}
                </div>
            </form>
        </FormProvider>
    );
}
