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
import { EquipmentPartPreviewPanel } from "@/components/equipment-parts";
import { useProducts } from "@/hooks";
import { useEquipmentPartPreview } from "@/hooks";
import { matchProductByBarcode } from "@/lib";

export function EquipmentProductionSection() {

    const { data: productsData } = useProducts();
    const products = (productsData?.data ?? []).filter(
        product => product.category.name === "Equipos de ordeño"
    );

    const [productId, setProductId] = useState<string>("");
    const [quantity, setQuantity] = useState<number | undefined>(undefined);

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
        <div className="mt-8 space-y-6">

            <p className="text-sm text-muted-foreground">
                Calcula cuántas piezas y cuánto material hace falta para producir N unidades de un equipo. La receta
                de piezas se define en Productos, al agregar componentes.
            </p>

            <div className="max-w-md">
                <Label className="mb-1">Equipo</Label>
                <Combobox
                    items={items}
                    value={selected}
                    onValueChange={(item) => setProductId(item ? item.value : "")}
                    onInputValueChange={(text) => {
                        const match = matchProductByBarcode(products, text);
                        if (match) {
                            setProductId(match.id);
                        }
                    }}
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
                                placeholder="1"
                                value={quantity ?? ""}
                                onChange={(e) => setQuantity(e.target.value === "" ? undefined : Number(e.target.value))}
                            />
                        </div>

                        <EquipmentPartPreviewPanel
                            preview={previewData?.data}
                            loading={isPreviewLoading}
                        />

                    </CardContent>
                </Card>
            )}

        </div>
    );

}
