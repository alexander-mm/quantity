import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onNewBrand: () => void;
};

export function BrandsToolbar({ onNewBrand }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewBrand}>
                <Plus size={18} />
                Nueva marca
            </Button>
        </div>
    );
}
