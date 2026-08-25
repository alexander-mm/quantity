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
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
                <SearchInput
                    placeholder="Buscar pieza..."
                    value={search}
                    onChange={onSearchChange}
                />

                <Select
                    value={categoryId || "all"}
                    onValueChange={(value) => onCategoryChange(!value || value === "all" ? "" : value)}
                >
                    <SelectTrigger className="w-full md:w-56">
                        <SelectValue placeholder="Todas las categorías">
                            {(value: string | null) =>
                                !value || value === "all"
                                    ? "Todas las categorías"
                                    : categories.find(category => category.id === value)?.name ?? "Todas las categorías"
                            }
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            Todas las categorías
                        </SelectItem>

                        {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button onClick={onNewPart}>
                <Plus size={18} />
                Nueva pieza
            </Button>
        </div>
    );
}
