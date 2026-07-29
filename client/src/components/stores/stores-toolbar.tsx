import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onNewStore: () => void;
};

export function StoresToolbar({ onNewStore }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewStore}>
                <Plus size={18} />
                Nueva tienda
            </Button>
        </div>
    );
}
