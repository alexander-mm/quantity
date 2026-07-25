import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
                        products.map(product=>(
                            <SelectItem
                                key={product.id}
                                value={product.id}
                            >
                                {product.internalCode} - {product.name}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
        </div>
    );
}