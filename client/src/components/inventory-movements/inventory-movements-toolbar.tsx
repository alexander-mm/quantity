import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
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
                <SearchInput
                    placeholder="Buscar movimiento..."
                    value={search}
                    onChange={onSearchChange}
                />
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