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
import { useClients, useProducts, useQuotes, useCreateQuote, useUpdateQuote, useProductPriceEntryLabels } from "@/hooks";
import { getNextSequentialCode, resolveProductPriceEntries, todayLocalDateString } from "@/lib";
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
        priceEntryKey: "",
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
            // Solo controla qué precio (PVP USD N / PVP COP N) se aplica a todas las líneas de esta cotización.
            priceEntryKey: "",
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

    const { data: productsData } = useProducts();
    const products = productsData?.data ?? [];

    const { data: priceEntryLabelsData } = useProductPriceEntryLabels();
    const priceEntryLabels = priceEntryLabelsData?.data ?? [];

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
    const clientId = useWatch({ control: methods.control, name: "clientId" });
    const priceEntryKey = useWatch({ control: methods.control, name: "priceEntryKey" });
    const hasShipping = useWatch({ control: methods.control, name: "hasShipping" });
    const shippingCostWatch = useWatch({ control: methods.control, name: "shippingCost" });
    const hasAdditionalCost = useWatch({ control: methods.control, name: "hasAdditionalCost" });
    const additionalCostWatch = useWatch({ control: methods.control, name: "additionalCost" });

    const selectedClient = clients.find(client => client.id === clientId);
    const clientDiscountPercentage = Number(selectedClient?.discountPercentage ?? 0);
    const hasClientDiscount = clientDiscountPercentage > 0;

    const filteredPriceEntryLabels = priceEntryLabels.filter(entry => entry.currency === currency);

    const applyPriceEntryToAllLines = async (priceEntryKey: string) => {

        methods.setValue("priceEntryKey", priceEntryKey);

        if (!priceEntryKey) {
            return;
        }

        const [entryCurrency, entrySequenceRaw] = priceEntryKey.split("-");
        const entrySequence = Number(entrySequenceRaw);
        const entryLabel = `PVP ${entryCurrency} ${entrySequenceRaw}`;
        const currentDetails = methods.getValues("details") ?? [];
        const productsMissingPrice: string[] = [];

        for (let index = 0; index < currentDetails.length; index++) {

            const productId = currentDetails[index]?.productId;

            if (!productId) {
                continue;
            }

            try {

                const entries = await resolveProductPriceEntries(productId);
                const match = entries.find(
                    entry => entry.currency === entryCurrency && entry.sequence === entrySequence
                );

                const newUnitPrice = match ? Number(match.price) : undefined;

                methods.setValue(`details.${index}.unitPrice`, newUnitPrice);

                if (!match) {

                    const product = products.find(item => item.id === productId);
                    productsMissingPrice.push(product ? `${product.internalCode} - ${product.name}` : productId);

                } else if (hasClientDiscount) {

                    const quantity = Number(currentDetails[index]?.quantity) || 0;

                    methods.setValue(
                        `details.${index}.discount`,
                        quantity * Number(match.price) * (clientDiscountPercentage / 100)
                    );

                }

            } catch (error) {
                console.error(error);
            }

        }

        if (productsMissingPrice.length > 0) {
            toast.error(
                `Sin precio "${entryLabel}" para: ${productsMissingPrice.join(", ")}. Ingresa el precio manualmente en cada línea.`
            );
        }

    };

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
                        <Select
                            value={currency}
                            onValueChange={(value) => {

                                methods.setValue("currency", value as "USD" | "COP");

                                const currentPriceEntryKey: string = methods.getValues("priceEntryKey") ?? "";
                                const [currentEntryCurrency] = currentPriceEntryKey.split("-");

                                if (currentPriceEntryKey && currentEntryCurrency !== value) {
                                    methods.setValue("priceEntryKey", "");
                                }

                            }}
                        >
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>
                        <Label className="mb-1">Precio</Label>
                        <Select
                            value={priceEntryKey ?? ""}
                            onValueChange={(value) => applyPriceEntryToAllLines(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Precio base del producto">
                                    {(value: string | null) =>
                                        filteredPriceEntryLabels.find(entry => `${entry.currency}-${entry.sequence}` === value)?.label
                                            ?? "Precio base del producto"
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {filteredPriceEntryLabels.map(entry => (
                                    <SelectItem key={`${entry.currency}-${entry.sequence}`} value={`${entry.currency}-${entry.sequence}`}>
                                        {entry.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Se aplica de inmediato a todos los productos ya agregados a la cotización. Solo se muestran precios en {currency}.
                        </p>
                    </div>

                    <div>
                        <Label className="mb-1">Válida hasta (opcional)</Label>
                        <Input type="date" className="max-w-xs" {...methods.register("validUntil")} />
                    </div>

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
