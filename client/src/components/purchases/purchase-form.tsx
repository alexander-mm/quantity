import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { purchaseSchema } from "@/validators";
import type { PurchaseFormData } from "@/validators";
import { useCreatePurchase, useUsers } from "@/hooks";
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
                purchaseDate:
                    new Date()
                        .toISOString()
                        .split("T")[0],
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

    const loading =
        createMutation.isPending;

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
                )
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
                onSubmit={methods.handleSubmit(onSubmit)}
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