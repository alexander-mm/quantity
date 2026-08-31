import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxItem, ComboboxEmpty } from "@/components/ui/combobox";
import { quoteSchema } from "@/validators";
import type { QuoteFormData } from "@/validators";
import { useClients, useQuotes, useCreateQuote, useUpdateQuote } from "@/hooks";
import { getNextSequentialCode, todayLocalDateString } from "@/lib";
import { getClientLabel } from "@/lib/client-label";
import { QuoteDetailsTable } from "./quote-details-table";
import { QuoteTotals } from "./quote-totals";
import type { Quote } from "@/types";

type Props = {
    quote?: Quote | null;
    onSuccess?: () => void;
};

function toFormData(quote: Quote): QuoteFormData {
    return {
        number: quote.number,
        clientId: quote.client.id,
        currency: quote.currency,
        quoteDate: quote.quoteDate.split("T")[0],
        validUntil: quote.validUntil ? quote.validUntil.split("T")[0] : "",
        observations: quote.observations ?? "",
        details: quote.details.map(d => ({
            productId: d.product.id,
            quantity: Number(d.quantity),
            unitPrice: Number(d.unitPrice),
            discount: Number(d.discount),
            tax: Number(d.tax)
        })),
        hasShipping: quote.hasShipping,
        shippingCost: quote.hasShipping ? Number(quote.shippingCost) : undefined,
        hasAdditionalCost: quote.hasAdditionalCost,
        additionalCost: quote.hasAdditionalCost ? Number(quote.additionalCost) : undefined
    };
}

export function QuoteForm({ quote, onSuccess }: Props) {

    const isEditing = !!quote;

    const methods = useForm<QuoteFormData>({
        resolver: zodResolver(quoteSchema),
        defaultValues: quote ? toFormData(quote) : {
            number: "",
            clientId: "",
            currency: "USD",
            quoteDate: todayLocalDateString(),
            validUntil: "",
            observations: "",
            details: [],
            hasShipping: false,
            shippingCost: undefined,
            hasAdditionalCost: false,
            additionalCost: undefined
        }
    });

    const { data: quotesData } = useQuotes();
    const { data: clientsData } = useClients();
    const clients = clientsData?.data ?? [];

    useEffect(() => {

        if (isEditing || !quotesData?.data || methods.getValues("number")) {
            return;
        }

        const [lastQuote] = [...quotesData.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Sin cotizaciones previas, arranca en COT-001 en vez de dejarlo en
        // blanco (getNextSequentialCode no tiene de dónde partir la primera vez).
        const nextNumber = lastQuote ? getNextSequentialCode(lastQuote.number) : "COT-001";

        if (nextNumber) {
            methods.setValue("number", nextNumber);
        }

    }, [isEditing, quotesData, methods]);

    const details = useWatch({ control: methods.control, name: "details" });
    const currency = useWatch({ control: methods.control, name: "currency" });
    const hasShipping = useWatch({ control: methods.control, name: "hasShipping" });
    const shippingCostWatch = useWatch({ control: methods.control, name: "shippingCost" });
    const hasAdditionalCost = useWatch({ control: methods.control, name: "hasAdditionalCost" });
    const additionalCostWatch = useWatch({ control: methods.control, name: "additionalCost" });

    const items = details ?? [];

    const subtotal = items.reduce(
        (sum, item) => sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0)),
        0
    );

    const discount = items.reduce((sum, item) => sum + Number(item.discount || 0), 0);
    const tax = items.reduce((sum, item) => sum + Number(item.tax || 0), 0);
    const shippingCost = hasShipping ? Number(shippingCostWatch || 0) : 0;
    const additionalCost = hasAdditionalCost ? Number(additionalCostWatch || 0) : 0;
    const total = subtotal - discount + tax + shippingCost + additionalCost;

    const createMutation = useCreateQuote();
    const updateMutation = useUpdateQuote();
    const loading = createMutation.isPending || updateMutation.isPending;

    const onSubmit = (data: QuoteFormData) => {

        const payload = {
            number: data.number,
            clientId: data.clientId,
            currency: data.currency,
            quoteDate: new Date(data.quoteDate),
            validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
            observations: data.observations || undefined,
            details: data.details.map(d => ({
                productId: d.productId,
                quantity: Number(d.quantity),
                unitPrice: Number(d.unitPrice),
                discount: d.discount ? Number(d.discount) : undefined,
                tax: d.tax ? Number(d.tax) : undefined
            })),
            hasShipping: !!data.hasShipping,
            shippingCost: data.hasShipping ? (Number(data.shippingCost) || 0) : undefined,
            hasAdditionalCost: !!data.hasAdditionalCost,
            additionalCost: data.hasAdditionalCost ? (Number(data.additionalCost) || 0) : undefined
        };

        if (isEditing) {

            updateMutation.mutate({ id: quote.id, data: payload }, {
                onSuccess: () => {
                    toast.success("Cotización actualizada.");
                    onSuccess?.();
                },
                onError: (error) => {
                    const message =
                        axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                            ? error.response.data.message
                            : "No se pudo actualizar la cotización.";
                    toast.error(message);
                }
            });

            return;

        }

        createMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Cotización registrada.");
                methods.reset();
                onSuccess?.();
            },
            onError: (error) => {
                const message =
                    axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "No se pudo registrar la cotización.";
                toast.error(message);
            }
        });

    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit, onFormError)} noValidate className="space-y-6 min-w-0">

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>
                        <Label className="mb-1">Número</Label>
                        <Input {...methods.register("number")} readOnly />
                        <p className="text-sm text-red-500">{methods.formState.errors.number?.message}</p>
                    </div>

                    <div>
                        <Label className="mb-1">Fecha</Label>
                        <Input type="date" {...methods.register("quoteDate")} />
                        <p className="text-sm text-red-500">{methods.formState.errors.quoteDate?.message}</p>
                    </div>

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div className="md:col-span-2">
                        <Label className="mb-1">Cliente</Label>
                        <Combobox
                            items={clients.map(client => ({ value: client.id, label: getClientLabel(client) }))}
                            value={(() => {
                                const clientId = methods.watch("clientId");
                                const client = clients.find(c => c.id === clientId);
                                return client ? { value: client.id, label: getClientLabel(client) } : null;
                            })()}
                            onValueChange={(item) => methods.setValue("clientId", item ? item.value : "")}
                        >
                            <ComboboxInput placeholder="Buscar cliente..." />
                            <ComboboxContent>
                                {(item) => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}
                            </ComboboxContent>
                            <ComboboxEmpty>No se encontraron clientes.</ComboboxEmpty>
                        </Combobox>
                        <p className="text-sm text-red-500">{methods.formState.errors.clientId?.message}</p>
                    </div>

                    <div>
                        <Label className="mb-1">Moneda</Label>
                        <Select value={currency} onValueChange={(value) => methods.setValue("currency", value as "USD" | "COP")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="COP">COP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                <div>
                    <Label className="mb-1">Válida hasta (opcional)</Label>
                    <Input type="date" className="max-w-xs" {...methods.register("validUntil")} />
                </div>

                <QuoteDetailsTable />

                <QuoteTotals subtotal={subtotal} discount={discount} tax={tax} total={total} currency={currency} />

                <div>
                    <Label className="mb-1">Observaciones (opcional)</Label>
                    <Input {...methods.register("observations")} />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Guardar cotización"}
                    </Button>
                </div>

            </form>
        </FormProvider>
    );

}
