import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { purchaseSchema } from "@/validators";
import type { PurchaseFormData } from "@/validators";
import { useCreatePurchase, useUpdatePurchase, useUsers, usePurchases } from "@/hooks";
import { getNextSequentialCode, todayLocalDateString } from "@/lib";
import { PurchaseHeader } from "./purchase-header";
import { PurchaseDetailsTable } from "./purchase-details-table";
import { PurchaseTotals } from "./purchase-totals";
import type { Purchase } from "@/types";

type Props = {
    purchase?: Purchase | null;
    onSuccess?: () => void;
};

function toFormData(purchase: Purchase): PurchaseFormData {
    return {
        number: purchase.number,
        supplierId: purchase.supplier.id,
        storeId: purchase.store.id,
        purchaseDate: purchase.purchaseDate.slice(0, 10),
        reference: purchase.reference ?? "",
        observations: purchase.observations ?? "",
        details: purchase.details.map(d => ({
            productId: d.product.id,
            quantity: Number(d.quantity),
            unitCost: Number(d.unitCost),
            pvp: Number(d.pvp ?? 0),
            pvpCop: d.pvpCop ? Number(d.pvpCop) : undefined,
            priceEntries: d.priceEntries.map(entry => ({
                currency: entry.currency,
                sequence: entry.sequence,
                price: Number(entry.price)
            })),
            discount: Number(d.discount),
            tax: Number(d.tax)
        }))
    };
}

export function PurchaseForm({
    purchase,
    onSuccess
}: Props) {

    const isEditing = !!purchase;

    const methods =
        useForm<PurchaseFormData>({

            resolver: zodResolver(
                purchaseSchema
            ),

            defaultValues: purchase ? toFormData(purchase) : {
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

    const updateMutation =
        useUpdatePurchase();

    const { data: purchasesData } = usePurchases();

    const loading =
        createMutation.isPending || updateMutation.isPending;

    useEffect(() => {

        if (isEditing || !purchasesData?.data || methods.getValues("number")) {
            return;
        }

        const [lastPurchase] = [...purchasesData.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const nextNumber = getNextSequentialCode(lastPurchase?.number);

        if (nextNumber) {
            methods.setValue("number", nextNumber);
        }

    }, [purchasesData, methods, isEditing]);

    const onSubmit = (
        data: PurchaseFormData
    ) => {

        if (isEditing) {

            updateMutation.mutate({
                id: purchase.id,
                data: {
                    ...data,
                    userId: purchase.user.id,
                    purchaseDate: new Date(data.purchaseDate),
                    details: data.details
                }
            }, {

                onSuccess: () => {
                    toast.success("Compra actualizada.");
                    onSuccess?.();
                },

                onError: () => {
                    toast.error("No se pudo actualizar la compra.");
                }

            });

            return;

        }

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
                                : isEditing ? "Guardar cambios" : "Guardar compra"
                        }
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
