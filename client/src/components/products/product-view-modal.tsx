import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductPrices } from "@/hooks";
import type { Product } from "@/types";

type Props = {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ProductViewModal({ product, open, onOpenChange }: Props) {

    const { data: pricesData } = useProductPrices(product?.id);
    const prices = pricesData?.data ?? [];

    const [manualSelection, setManualSelection] = useState<
        { productId: string; profileId: string } | null
    >(null);

    const selectedProfileId =
        manualSelection && manualSelection.productId === product?.id
            ? manualSelection.profileId
            : (prices[0]?.marginProfileId ?? "");

    const selectedPrice = prices.find(p => p.marginProfileId === selectedProfileId);

    if (!product) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    setManualSelection(null);
                }
                onOpenChange(next);
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{product.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Código</p>
                            <p className="font-medium">{product.internalCode}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Marca</p>
                            <p className="font-medium">{product.brand.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Categoría</p>
                            <p className="font-medium">{product.category.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Stock mínimo</p>
                            <p className="font-medium">{product.minimumStock}</p>
                        </div>
                    </div>

                    <div>
                        <Label>Perfil de precio</Label>
                        <Select
                            value={selectedProfileId}
                            onValueChange={(v) =>
                                setManualSelection(
                                    v && product
                                        ? { productId: product.id, profileId: v }
                                        : null
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un perfil" />
                            </SelectTrigger>
                            <SelectContent>
                                {prices.map(price => (
                                    <SelectItem key={price.marginProfileId} value={price.marginProfileId}>
                                        {price.marginProfileName} (-{Number(price.marginProfilePercentage)}%)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedPrice && (
                        <div className="rounded-lg border bg-muted/40 p-4 text-center">
                            <p className="text-sm text-muted-foreground">Precio de venta</p>
                            <p className="text-3xl font-bold">
                                ${Number(selectedPrice.price).toFixed(2)}
                            </p>
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
}
