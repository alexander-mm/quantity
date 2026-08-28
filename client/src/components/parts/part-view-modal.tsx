import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format-currency";
import { usePartComponents, usePartComponentProducts } from "@/hooks";
import type { Part } from "@/types";

type Props = {
    part: Part | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function PartViewModal({ part, open, onOpenChange }: Props) {

    const { data: componentsData } = usePartComponents(part?.id);
    const { data: componentProductsData } = usePartComponentProducts(part?.id);

    const components = componentsData?.data ?? [];
    const componentProducts = componentProductsData?.data ?? [];

    if (!part) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{part.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Código</p>
                            <p className="font-medium">{part.code}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Categoría</p>
                            <p className="font-medium">{part.category?.name ?? "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Cantidad disponible</p>
                            <p className="font-medium">{Number(part.quantity)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Stock mínimo</p>
                            <p className="font-medium">{Number(part.minimumStock)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Costo</p>
                            <p className="font-medium">{formatCurrency(part.cost, "USD")}</p>
                        </div>
                    </div>

                    {part.description && (
                        <div>
                            <p className="text-sm text-muted-foreground">Descripción</p>
                            <p className="font-medium">{part.description}</p>
                        </div>
                    )}

                    {(components.length > 0 || componentProducts.length > 0) && (
                        <div className="space-y-2 rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground">Receta de ensamblaje</p>

                            {components.map(item => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                    <span>{item.componentPart.code} - {item.componentPart.name}</span>
                                    <span className="font-medium">{Number(item.quantity)}</span>
                                </div>
                            ))}

                            {componentProducts.map(item => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                    <span>{item.componentProduct.internalCode} - {item.componentProduct.name}</span>
                                    <span className="font-medium">{Number(item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
}
