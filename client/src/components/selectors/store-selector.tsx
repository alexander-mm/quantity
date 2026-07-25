import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Store } from "@/types";

type Props={
    stores:Store[];
    value:string;
    label?:string;
    placeholder?:string;
    onChange:(value:string|null)=>void;
};

export function StoreSelector({
    stores,
    value,
    label="Bodega",
    placeholder="Seleccione una bodega",
    onChange
}:Props){
    return(
        <div className="flex-1">
            <Label>{label}</Label>
            <Select
                value={value}
                onValueChange={onChange}
            >
                <SelectTrigger>
                    <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
                <SelectContent>
                    {
                        stores.map(store=>(
                            <SelectItem
                                key={store.id}
                                value={store.id}
                            >
                                {store.name}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
        </div>
    );
}