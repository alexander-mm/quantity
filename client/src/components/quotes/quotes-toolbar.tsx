import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";

type Props = {
    onNewQuote: () => void;
    search: string;
    onSearchChange: (value: string) => void;
};

export function QuotesToolbar({ onNewQuote, search, onSearchChange }: Props) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full max-w-md">
                <SearchInput
                    placeholder="Buscar cotización..."
                    value={search}
                    onChange={onSearchChange}
                />
            </div>
            <Button onClick={onNewQuote}>
                <Plus size={18} />
                Nueva cotización
            </Button>
        </div>
    );
}
