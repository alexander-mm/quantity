import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { StoreSelector } from "@/components/selectors";
import type { Store } from "@/types";

type Props={
    onNewSale:()=>void;
    search:string;
    onSearchChange:(value:string)=>void;
    stores:Store[];
    storeId:string;
    onStoreChange:(value:string)=>void;
};

export function SalesToolbar({
    onNewSale,
    search,
    onSearchChange,
    stores,
    storeId,
    onStoreChange
}:Props){

    return(

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">

                <SearchInput
                    placeholder="Buscar venta..."
                    value={search}
                    onChange={onSearchChange}
                />

                <div className="w-full md:w-56">
                    <StoreSelector
                        stores={stores}
                        value={storeId || "all"}
                        label=""
                        placeholder="Todas las tiendas"
                        aggregateOption={{ value: "all", label: "Todas las tiendas" }}
                        onChange={(value) => onStoreChange(!value || value === "all" ? "" : value)}
                    />
                </div>

            </div>

            <Button
                onClick={onNewSale}
            >
                <Plus size={18}/>
                Nueva venta
            </Button>

        </div>

    );

}
