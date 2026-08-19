import { Label } from "@/components/ui/label";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import { matchProductByBarcode } from "@/lib";
import type { Product } from "@/types";

type Props={
    products:Product[];
    value:string;
    label?:string;
    placeholder?:string;
    onChange:(value:string|null)=>void;
};

export function ProductSelector({
    products,
    value,
    label="Producto",
    placeholder="Seleccione un producto",
    onChange
}:Props){

    const items = products.map(product => ({
        value: product.id,
        label: `${product.internalCode} - ${product.name}`
    }));

    const selected = items.find(item => item.value === value) ?? null;

    return(
        <div className="flex-1">
            <Label className="mb-1">{label}</Label>
            <Combobox
                items={items}
                value={selected}
                onValueChange={(item) => onChange(item ? item.value : "")}
                onInputValueChange={(text) => {
                    const match = matchProductByBarcode(products, text);
                    if (match) {
                        onChange(match.id);
                    }
                }}
            >
                <ComboboxInput placeholder={placeholder} />
                <ComboboxContent>
                    {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                            {item.label}
                        </ComboboxItem>
                    )}
                </ComboboxContent>
                <ComboboxEmpty>
                    No se encontraron productos.
                </ComboboxEmpty>
            </Combobox>
        </div>
    );
}
