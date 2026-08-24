import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import { BarcodeScanButton } from "@/components/scanner";
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

    // Se dispara en cada tecleo (búsqueda en vivo, o el "tecleo" rápido de un
    // lector USB): silencioso si no matchea, porque casi ningún tecleo normal
    // coincide con un código completo.
    const handleTypedText = (text: string) => {

        const match = matchProductByBarcode(products, text);

        if (match) {
            onChange(match.id);
        }

    };

    // Un escaneo de cámara es una acción explícita y puntual: si no matchea,
    // sí avisamos.
    const handleScannedText = (text: string) => {

        const match = matchProductByBarcode(products, text);

        if (match) {
            onChange(match.id);
        } else {
            toast.error(`No se encontró un producto con el código "${text}".`);
        }

    };

    return(
        <div className="flex-1">
            <Label className="mb-1">{label}</Label>
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <Combobox
                        items={items}
                        value={selected}
                        onValueChange={(item) => onChange(item ? item.value : "")}
                        onInputValueChange={handleTypedText}
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
                <BarcodeScanButton onScan={handleScannedText} />
            </div>
        </div>
    );
}
