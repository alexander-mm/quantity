import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";
import type { Supplier } from "@/types";

type SuppliersToolbarProps = {
    onNewSupplier: () => void;
    suppliers: Supplier[];
    onSearchChange: (value: string) => void;
};

export function SuppliersToolbar({
    onNewSupplier,
    suppliers,
    onSearchChange
}: SuppliersToolbarProps) {

    type SupplierOption = { value: string; label: string };

    const items: SupplierOption[] = suppliers.map(supplier => ({
        value: supplier.id,
        label: `${supplier.code} - ${supplier.companyName}`
    }));

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full max-w-md">
                <Combobox
                    items={items}
                    onInputValueChange={onSearchChange}
                    onValueChange={(item: SupplierOption | null) => {
                        if (item) {
                            onSearchChange(item.label);
                        }
                    }}
                >
                    <ComboboxInput placeholder="Buscar proveedor..." />
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
            <Button onClick={onNewSupplier}>
                <Plus size={18} />
                Nuevo proveedor
            </Button>
        </div>
    );

}
