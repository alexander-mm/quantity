import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Store } from "@/types";

type AggregateOption = {
    value: string;
    label: string;
};

type Props={
    stores:Store[];
    value:string;
    label?:string;
    placeholder?:string;
    onChange:(value:string|null)=>void;
    // Item extra al principio de la lista (ej. "Total (todas las tiendas)") para
    // ofrecer, además de "una tienda a la vez", una vista agregada de todas.
    aggregateOption?: AggregateOption;
};

export function StoreSelector({
    stores,
    value,
    label="Bodega",
    placeholder="Seleccione una bodega",
    onChange,
    aggregateOption
}:Props){
    return(
        <div className="flex-1">
            <Label className="mb-1">{label}</Label>
            <Select
                value={value}
                onValueChange={onChange}
            >
                <SelectTrigger>
                    <SelectValue placeholder={placeholder}>
                        {(selectedValue: string | null) =>
                            (aggregateOption && selectedValue === aggregateOption.value
                                ? aggregateOption.label
                                : stores.find(store => store.id === selectedValue)?.name) ?? placeholder
                        }
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {aggregateOption && (
                        <SelectItem value={aggregateOption.value}>
                            {aggregateOption.label}
                        </SelectItem>
                    )}
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