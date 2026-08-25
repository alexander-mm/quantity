import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

type Store = {
    id: string;
    name: string;
};

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

                <Select
                    value={storeId || "all"}
                    onValueChange={(value) => onStoreChange(!value || value === "all" ? "" : value)}
                >
                    <SelectTrigger className="w-full md:w-56">
                        <SelectValue placeholder="Todas las tiendas">
                            {(value: string | null) =>
                                !value || value === "all"
                                    ? "Todas las tiendas"
                                    : stores.find(store => store.id === value)?.name ?? "Todas las tiendas"
                            }
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            Todas las tiendas
                        </SelectItem>

                        {stores.map(store => (
                            <SelectItem key={store.id} value={store.id}>
                                {store.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

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
