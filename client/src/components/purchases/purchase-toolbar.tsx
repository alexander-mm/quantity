import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";

type Props = {
    onNewPurchase: () => void;
    search: string;
    onSearchChange: (value: string) => void;
};

export function PurchasesToolbar({
    onNewPurchase,
    search,
    onSearchChange
}: Props) {

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchInput
                placeholder="Buscar compra..."
                value={search}
                onChange={onSearchChange}
            />
            <Button onClick={onNewPurchase}>
                <Plus size={18} />
                Nueva compra
            </Button>
        </div>
    );

}