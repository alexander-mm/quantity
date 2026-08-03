import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { saleSchema } from "@/validators";
import type { SaleFormData } from "@/validators";

import { useCreateSale, useUsers } from "@/hooks";
import { SaleHeader } from "./sale-header";
import { SaleDetailsTable } from "./sale-details-table";
import { SaleTotals } from "./sale-totals";

type Props = {
    onSuccess?: () => void;
};

export function SaleForm({
    onSuccess
}: Props) {

    const methods =
        useForm<SaleFormData>({

            resolver: zodResolver(
                saleSchema
            ),

            defaultValues: {
                number: "",
                clientId: "",
                storeId: "",
                currency: "USD",
                saleDate:
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

const currency =
    useWatch({
        control: methods.control,
        name: "currency"
    });

   const items = details ?? [];

const subtotal =
    items.reduce(
        (sum, item) =>
            sum +
            (
                Number(item.quantity || 0) *
                Number(item.unitPrice || 0)
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
        useCreateSale();

    const loading =
        createMutation.isPending;

    const onSubmit = (
        data: SaleFormData
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

            saleDate:
                new Date(
                    data.saleDate
                )

        }, {

            onSuccess: () => {

                toast.success(
                    "Venta registrada."
                );

                methods.reset();

                onSuccess?.();

            },

            onError: () => {

                toast.error(
                    "No se pudo registrar la venta."
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

                <SaleHeader />

                <SaleDetailsTable />

                <SaleTotals

                    subtotal={subtotal}

                    discount={discount}

                    tax={tax}

                    total={total}

                    currency={currency}

                />

                <div className="flex justify-end">

                    <Button
                        type="submit"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Guardando..."
                                : "Guardar venta"
                        }

                    </Button>

                </div>

            </form>

        </FormProvider>

    );

}
