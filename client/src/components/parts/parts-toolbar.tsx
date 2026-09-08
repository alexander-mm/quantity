import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxEmpty
} from "@/components/ui/combobox";

type PartCategory = {
    id: string;
    name: string;
};

type Props = {
    onNewPart: () => void;
    search: string;
    onSearchChange: (value: string) => void;
    categories: PartCategory[];
    categoryId: string;
    onCategoryChange: (value: string) => void;
};

export function PartsToolbar({
    onNewPart,
    search,
    onSearchChange,
    categories,
    categoryId,
    onCategoryChange
}: Props) {

    const items = [
        { value: "all", label: "Todas las categorías" },
        ...categories.map(category => ({ value: category.id, label: category.name }))
    ];

    const selected = items.find(item => item.value === (categoryId || "all")) ?? null;

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
                <SearchInput
                    placeholder="Buscar pieza..."
                    value={search}
                    onChange={onSearchChange}
                />

                <div className="w-full md:w-56">
                    <Combobox
                        items={items}
                        value={selected}
                        onValueChange={(item) => onCategoryChange(!item || item.value === "all" ? "" : item.value)}
                    >
                        <ComboboxInput placeholder="Todas las categorías" />
                        <ComboboxContent>
                            {(item) => (
                                <ComboboxItem key={item.value} value={item}>
                                    {item.label}
                                </ComboboxItem>
                            )}
                        </ComboboxContent>
                        <ComboboxEmpty>
                            No se encontraron categorías.
                        </ComboboxEmpty>
                    </Combobox>
                </div>
            </div>

            <Button onClick={onNewPart}>
                <Plus size={18} />
                Nueva pieza
            </Button>
        </div>
    );
}
