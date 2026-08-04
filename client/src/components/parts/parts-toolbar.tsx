import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
    onNewPart: () => void;
    search: string;
    onSearchChange: (value: string) => void;
};

export function PartsToolbar({ onNewPart, search, onSearchChange }: Props) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar pieza..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <Button onClick={onNewPart}>
                <Plus size={18} />
                Nueva pieza
            </Button>
        </div>
    );
}
