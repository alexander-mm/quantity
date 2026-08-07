import { useState } from "react";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components";
import { EquipmentPartPreviewPanel } from "@/components/equipment-parts";
import { useProducts } from "@/hooks";
import { useEquipmentPartPreview } from "@/hooks";

export function EquipmentPartsPage() {

    const { data: productsData } = useProducts();
    const products = productsData?.data ?? [];

    const [productId, setProductId] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);

    const { data: previewData, isFetching: isPreviewLoading } = useEquipmentPartPreview(
        productId || undefined,
        quantity || undefined
    );

    const items = products.map(product => ({
        value: product.id,
        label: `${product.internalCode} - ${product.name}`
    }));

    const selected = items.find(item => item.value === productId) ?? null;

    return (
        <PageContainer>

            <PageHeader
                title="Cálculo de producción"
                description="Calcula cuántas piezas y cuánto material hace falta para producir N unidades de un equipo. La receta de piezas se define en Productos, al agregar componentes."
            />

            <div className="mt-8 max-w-md">
                <Label className="mb-1">Equipo</Label>
                <Combobox
                    items={items}
                    value={selected}
                    onValueChange={(item) => setProductId(item ? item.value : "")}
                >
                    <ComboboxInput placeholder="Buscar equipo..." />
                    <ComboboxContent>
                        {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                                {item.label}
                            </ComboboxItem>
                        )}
                    </ComboboxContent>
                    <ComboboxEmpty>
                        No se encontraron equipos.
                    </ComboboxEmpty>
                </Combobox>
            </div>

            {productId && (
                <div className="mt-6 space-y-6">

                    <Card>
                        <CardHeader>
                            <CardTitle>Calcular producción</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div className="max-w-xs">
                                <Label>Cantidad de equipos a producir</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    step="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                                />
                            </div>

                            <EquipmentPartPreviewPanel
                                preview={previewData?.data}
                                loading={isPreviewLoading}
                            />

                        </CardContent>
                    </Card>

                </div>
            )}

        </PageContainer>
    );
}
