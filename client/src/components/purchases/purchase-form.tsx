import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { purchaseSchema } from "@/validators";
import type { PurchaseFormData } from "@/validators";
import { useCreatePurchase, useUsers, usePurchases } from "@/hooks";
import { getNextSequentialCode, todayLocalDateString } from "@/lib";
import { PurchaseHeader } from "./purchase-header";
import { PurchaseDetailsTable } from "./purchase-details-table";
import { PurchaseTotals } from "./purchase-totals";

type Props = {
    onSuccess?: () => void;
};

export function PurchaseForm({
    onSuccess
}: Props) {

    const methods =
        useForm<PurchaseFormData>({

            resolver: zodResolver(
                purchaseSchema
            ),

            defaultValues: {
                number: "",
                supplierId: "",
                storeId: "",
                purchaseDate: todayLocalDateString(),
                reference: "",
                observations: "",
                details: []
            }
        });

const details =
    useWatch({
        control: methods.control,
        name: "details"
    });

   const items = details ?? [];

const subtotal =
    items.reduce(
        (sum, item) =>
            sum +
            (
                Number(item.quantity || 0) *
                Number(item.unitCost || 0)
            ),
        0
    );

const discount =
    items.reduce(
        (sum, item) =>
            sum +
            Number(item.discount || 0),
        0
    );

const tax =
    items.reduce(
        (sum, item) =>
            sum +
            Number(item.tax || 0),
        0
    );

const total =
    subtotal -
    discount +
    tax;

    const {
        data: usersData
    } = useUsers();

    const users =
        usersData?.data ?? [];

    const createMutation =
        useCreatePurchase();

    const { data: purchasesData } = usePurchases();

    const loading =
        createMutation.isPending;

    useEffect(() => {

        if (!purchasesData?.data || methods.getValues("number")) {
            return;
        }

        const [lastPurchase] = [...purchasesData.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const nextNumber = getNextSequentialCode(lastPurchase?.number);

        if (nextNumber) {
            methods.setValue("number", nextNumber);
        }

    }, [purchasesData, methods]);

    const onSubmit = (
        data: PurchaseFormData
    ) => {

        if (users.length === 0) {

            toast.error(
                "No existen usuarios registrados."
            );

            return;
        }

        createMutation.mutate({
            ...data,
            userId:
                users[0]!.id,
            purchaseDate:
                new Date(
                    data.purchaseDate
                ),
            details: data.details
        }, {

            onSuccess: () => {
                toast.success(
                    "Compra registrada."
                );
                methods.reset();
                onSuccess?.();
            },

            onError: () => {
                toast.error(
                    "No se pudo registrar la compra."
                );
            }
        });
    };

    return (

        <FormProvider
            {...methods}
        >
            <form
                onSubmit={methods.handleSubmit(onSubmit, onFormError)}
                noValidate
                className="space-y-6 min-w-0"
            >
                <PurchaseHeader />
                <PurchaseDetailsTable />
                <PurchaseTotals
                    subtotal={subtotal}
                    discount={discount}
                    tax={tax}
                    total={total}
                />

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Guardando..."
                                : "Guardar compra"
                        }
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}