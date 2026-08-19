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
import { useParts, usePartIdsWithRecipe, usePartProductionPreview } from "@/hooks";
import { PartProductionPreview } from "./part-production-preview";

export function PartProductionSection() {

    const { data: partsData } = useParts();
    const { data: recipeIdsData } = usePartIdsWithRecipe();

    const parts = partsData?.data ?? [];
    const recipeIds = new Set(recipeIdsData?.data ?? []);
    const producibleParts = parts.filter(part => recipeIds.has(part.id));

    const [partId, setPartId] = useState<string>("");
    const [quantity, setQuantity] = useState<number | undefined>(undefined);

    const { data: previewData, isFetching: isPreviewLoading } = usePartProductionPreview(
        partId || undefined,
        quantity || undefined
    );

    const items = producibleParts.map(part => ({
        value: part.id,
        label: `${part.code} - ${part.name}`
    }));

    const selected = items.find(item => item.value === partId) ?? null;

    return (
        <div className="mt-8 space-y-6">

            <p className="text-sm text-muted-foreground">
                Calcula cuántas sub-piezas, productos y materia prima hacen falta para producir N unidades de una
                pieza. La receta se define en Piezas, al agregar componentes.
            </p>

            <div className="max-w-md">
                <Label className="mb-1">Pieza</Label>
                <Combobox
                    items={items}
                    value={selected}
                    onValueChange={(item) => setPartId(item ? item.value : "")}
                >
                    <ComboboxInput placeholder="Buscar pieza..." />
                    <ComboboxContent>
                        {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                                {item.label}
                            </ComboboxItem>
                        )}
                    </ComboboxContent>
                    <ComboboxEmpty>
                        Ninguna pieza tiene una receta de piezas o productos definida.
                    </ComboboxEmpty>
                </Combobox>
            </div>

            {partId && (
                <Card>
                    <CardHeader>
                        <CardTitle>Calcular producción</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <div className="max-w-xs">
                            <Label>Cantidad de piezas a producir</Label>
                            <Input
                                type="number"
                                min={1}
                                step="1"
                                placeholder="1"
                                value={quantity ?? ""}
                                onChange={(e) => setQuantity(e.target.value === "" ? undefined : Number(e.target.value))}
                            />
                        </div>

                        <PartProductionPreview
                            preview={previewData?.data}
                            loading={isPreviewLoading}
                        />

                    </CardContent>
                </Card>
            )}

        </div>
    );

}
