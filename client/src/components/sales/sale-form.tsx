import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { saleSchema } from "@/validators";
import type { SaleFormData } from "@/validators";
import { useCreateSale, useUpdateSale, useUsers, useAuth, useSales } from "@/hooks";
import { generateOfflineId, getNextSequentialCode, todayLocalDateString } from "@/lib";
import { SaleHeader } from "./sale-header";
import { SalePaymentSection } from "./sale-payment-section";
import { SaleDetailsTable } from "./sale-details-table";
import { SaleTotals } from "./sale-totals";
import type { Sale } from "@/types";

type Props = {
    sale?: Sale | null;
    onSuccess?: () => void;
};

function toFormData(sale: Sale): SaleFormData {
    return {
        number: sale.number,
        clientId: sale.client.id,
        storeId: sale.store.id,
        currency: sale.currency,
        saleDate: sale.saleDate.split("T")[0],
        reference: sale.reference ?? "",
        observations: sale.observations ?? "",
        hasShipping: sale.hasShipping,
        shippingCost: sale.hasShipping ? Number(sale.shippingCost) : undefined,
        paymentMethod: sale.paymentMethod,
        transferVouchers: sale.transferVouchers.map(v => v.number),
        accountReceivableNumber: sale.accountReceivable?.number ?? "",
        downPayment: sale.accountReceivable ? Number(sale.accountReceivable.downPayment) : undefined,
        downPaymentMethod: sale.accountReceivable?.downPaymentMethod ?? undefined,
        downPaymentVouchers: sale.accountReceivable?.downPaymentVouchers.map(v => v.number) ?? [],
        termDays: sale.accountReceivable?.termDays ?? undefined,
        priceEntryKey: "",
        totalDiscountPercentage: undefined,
        details: sale.details.map(d => ({
            productId: d.product.id,
            quantity: Number(d.quantity),
            unitPrice: Number(d.unitPrice),
            discount: Number(d.discount),
            tax: Number(d.tax)
        }))
    };
}

export function SaleForm({
    sale,
    onSuccess
}: Props) {

    const isEditing = !!sale;

    const methods =
        useForm<SaleFormData>({

            resolver: zodResolver(
                saleSchema
            ),

            defaultValues: sale ? toFormData(sale) : {
                number: "",
                clientId: "",
                storeId: "",
                currency: "USD",
                saleDate: todayLocalDateString(),
                reference: "",
                observations: "",
                hasShipping: false,
                shippingCost: undefined,
                paymentMethod: "CASH",
                transferVouchers: [],
                accountReceivableNumber: "",
                downPayment: undefined,
                downPaymentMethod: undefined,
                downPaymentVouchers: [],
                termDays: undefined,
                // Solo controla qué precio (PVP USD N / PVP COP N) se aplica a todas las líneas de esta venta.
                priceEntryKey: "",
                // Solo controla el % de descuento que se reparte entre las líneas de esta venta.
                totalDiscountPercentage: undefined,
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

const hasShipping =
    useWatch({
        control: methods.control,
        name: "hasShipping"
    });

const shippingCostValue =
    useWatch({
        control: methods.control,
        name: "shippingCost"
    });

const shippingCost = hasShipping ? Number(shippingCostValue || 0) : 0;

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
    tax +
    shippingCost;

    const {
        data: usersData
    } = useUsers();

    const users =
        usersData?.data ?? [];

    const { user: currentUser } = useAuth();

    const createMutation =
        useCreateSale();

    const updateMutation =
        useUpdateSale();

    const { data: salesData } = useSales();

    const loading =
        createMutation.isPending || updateMutation.isPending;

    useEffect(() => {

        if (isEditing || !salesData?.data || methods.getValues("number")) {
            return;
        }

        const [lastSale] = [...salesData.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const nextNumber = getNextSequentialCode(lastSale?.number);

        if (nextNumber) {
            methods.setValue("number", nextNumber);
        }

    }, [salesData, methods, isEditing]);

    const onSubmit = (
        data: SaleFormData
    ) => {

        if (isEditing) {

            updateMutation.mutate({
                id: sale.id,
                data: {
                    ...data,
                    userId: sale.user.id,
                    status: sale.status as "DRAFT" | "CONFIRMED" | "CANCELLED",
                    saleDate: new Date(data.saleDate)
                }
            }, {
                onSuccess: () => {
                    toast.success("Venta actualizada.");
                    onSuccess?.();
                },
                onError: (error) => {
                    const message =
                        axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                            ? error.response.data.message
                            : "No se pudo actualizar la venta.";
                    toast.error(message);
                }
            });

            return;

        }

        const userId = currentUser?.id ?? users[0]?.id;

        if (!userId) {
            toast.error( "No existen usuarios registrados." );
            return;
        }
        createMutation.mutate({
            ...data,
            clientUuid:
                generateOfflineId(),
            userId,
            saleDate:
                new Date(
                    data.saleDate
                )
        }, {
            onSuccess: (result) => {
                if (result.queued) {
                    toast.success( "Sin conexión: la venta quedó guardada y se sincronizará automáticamente." );
                } else {
                    toast.success( "Venta registrada." );
                }
                methods.reset();
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo registrar la venta.";
                toast.error(message);
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
                <SaleHeader />
                <SalePaymentSection />
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
                                : isEditing ? "Guardar cambios" : "Guardar venta"
                        }
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
