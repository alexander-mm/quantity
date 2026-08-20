import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreSelector } from "@/components/selectors/store-selector";
import type { Store } from "@/types";

type Props = {
    onNewMovement: () => void;
    search: string;
    onSearchChange: (value: string) => void;
    stores: Store[];
    storeId: string;
    onStoreChange: (value: string) => void;
};

export function InventoryMovementsToolbar({
    onNewMovement,
    search,
    onSearchChange,
    stores,
    storeId,
    onStoreChange
}: Props) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 md:flex-1 md:flex-row md:items-end">
                <div className="relative w-full max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar movimiento..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="w-full max-w-xs">
                    <StoreSelector
                        stores={stores}
                        value={storeId}
                        label="Tienda"
                        placeholder="Todas las tiendas"
                        onChange={(value) => onStoreChange(value ?? "")}
                    />
                </div>
            </div>
            <Button onClick={onNewMovement}>
                <Plus size={18} />
                Nuevo movimiento
            </Button>
        </div>
    );
}