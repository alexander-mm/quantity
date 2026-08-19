import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format-currency";
import { useAuth, useProduct, useProductPriceEntries, useMarginProfiles } from "@/hooks";
import { ROLES } from "@/constants/roles";
import type { Product } from "@/types";

type Props = {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ProductViewModal({ product, open, onOpenChange }: Props) {

    const { user } = useAuth();
    const isAdmin = user?.roleName === ROLES.ADMIN;
    const { data: detailData } = useProduct(product?.id);
    const { data: priceEntriesData } = useProductPriceEntries(product?.id);
    const { data: marginProfilesData } = useMarginProfiles();

    const detail = detailData?.data;
    const priceEntries = priceEntriesData?.data ?? [];
    const marginProfiles = marginProfilesData?.data ?? [];

    const [manualSelection, setManualSelection] = useState<
        { productId: string; profileId: string } | null
    >(null);

    const selectedProfileId =
        manualSelection && manualSelection.productId === product?.id
            ? manualSelection.profileId
            : "";

    const selectedProfile = marginProfiles.find(profile => profile.id === selectedProfileId);
    const discountPercentage = selectedProfile ? Number(selectedProfile.percentage) : 0;

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
                        {detail?.barcode && (
                            <div>
                                <p className="text-sm text-muted-foreground">Código de barras</p>
                                <p className="font-medium">{detail.barcode}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-muted-foreground">Marca</p>
                            <p className="font-medium">{product.brand.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Categoría</p>
                            <p className="font-medium">{product.category.name}</p>
                        </div>
                        {detail?.unitOfMeasure && (
                            <div>
                                <p className="text-sm text-muted-foreground">Unidad de medida</p>
                                <p className="font-medium">{detail.unitOfMeasure}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-muted-foreground">Stock mínimo</p>
                            <p className="font-medium">{product.minimumStock}</p>
                        </div>
                        {isAdmin && product.costPrice && (
                            <div>
                                <p className="text-sm text-muted-foreground">Precio de costo</p>
                                <p className="font-medium">{formatCurrency(product.costPrice, "USD")}</p>
                            </div>
                        )}
                    </div>

                    {detail?.description && (
                        <div>
                            <p className="text-sm text-muted-foreground">Descripción</p>
                            <p className="font-medium">{detail.description}</p>
                        </div>
                    )}

                    <div>
                        <Label className="mb-1">Perfil de precio</Label>
                        <Select
                            value={selectedProfileId}
                            onValueChange={(v) =>
                                setManualSelection(
                                    v && product ? { productId: product.id, profileId: v } : null
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Precio base (sin perfil)" />
                            </SelectTrigger>
                            <SelectContent>
                                {marginProfiles.map(profile => (
                                    <SelectItem key={profile.id} value={profile.id}>
                                        {profile.name} (-{Number(profile.percentage)}%)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">
                            {selectedProfile
                                ? `Recalculado con "${selectedProfile.name}" (-${discountPercentage}%)`
                                : "Precios de venta registrados"}
                        </p>

                        {priceEntries.length === 0 && (
                            <p className="text-sm text-muted-foreground">No hay precios de venta registrados.</p>
                        )}

                        {priceEntries.map(entry => {

                            const basePrice = Number(entry.price);
                            const finalPrice = selectedProfile
                                ? Number((basePrice * (1 - discountPercentage / 100)).toFixed(2))
                                : basePrice;

                            return (
                                <div key={entry.id} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{entry.label}</span>
                                    <span className="font-semibold">{formatCurrency(finalPrice, entry.currency)}</span>
                                </div>
                            );

                        })}
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
