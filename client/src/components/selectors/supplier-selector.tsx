import { Label } from "@/components/ui/label";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import type { Supplier } from "@/types";

type Props = {
    suppliers: Supplier[];
    value: string;
    label?: string;
    placeholder?: string;
    onChange: (value: string | null) => void;
};

export function SupplierSelector({
    suppliers,
    value,
    label = "Proveedor",
    placeholder = "Seleccione un proveedor",
    onChange
}: Props) {

    const items = suppliers.map(supplier => ({ value: supplier.id, label: supplier.companyName }));
    const selected = items.find(item => item.value === value) ?? null;

    return (
        <div className="flex-1">
            <Label className="mb-1">{label}</Label>
            <Combobox
                items={items}
                value={selected}
                onValueChange={(item) => onChange(item ? item.value : "")}
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
                    No se encontraron proveedores.
                </ComboboxEmpty>
            </Combobox>
        </div>
    );
}
