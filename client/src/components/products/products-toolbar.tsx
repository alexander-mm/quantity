import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreSelector } from "@/components/selectors/store-selector";
import { BarcodeScanButton } from "@/components/scanner";
import { useAuth } from "@/hooks";
import { ROLES } from "@/constants/roles";
import type { Store } from "@/types";

type ProductsToolbarProps = {

    onNewProduct: () => void;

    search: string;
    onSearchChange: (value: string) => void;

    stores: Store[];
    storeId: string;
    onStoreChange: (value: string) => void;

};

export function ProductsToolbar(
    {
        onNewProduct,
        search,
        onSearchChange,
        stores,
        storeId,
        onStoreChange
    }: ProductsToolbarProps
) {

    const { user } = useAuth();
    const isAdmin = user?.roleName === ROLES.ADMIN;

    return (

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div className="flex flex-col gap-4 md:flex-1 md:flex-row md:items-end">

                <div className="flex w-full max-w-md items-center gap-2">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={18}
                        />

                        <Input
                            placeholder="Buscar producto..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    <BarcodeScanButton onScan={onSearchChange} />
                </div>

                <div className="w-full max-w-xs">
                    <StoreSelector
                        stores={stores}
                        value={storeId}
                        label="Tienda"
                        placeholder="Ver existencias por tienda"
                        onChange={(value) => onStoreChange(value ?? "")}
                    />
                </div>

            </div>

            {isAdmin && (
                <Button
                    onClick={onNewProduct}
                >
                    <Plus size={18} />
                    Nuevo producto
                </Button>
            )}
        </div>
    );
}
