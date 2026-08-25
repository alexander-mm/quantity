import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";

type Props = {
    onNewRawMaterial: () => void;
    search: string;
    onSearchChange: (value: string) => void;
};

export function RawMaterialsToolbar({ onNewRawMaterial, search, onSearchChange }: Props) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchInput
                placeholder="Buscar materia prima..."
                value={search}
                onChange={onSearchChange}
            />
            <Button onClick={onNewRawMaterial}>
                <Plus size={18} />
                Nueva materia prima
            </Button>
        </div>
    );
}
