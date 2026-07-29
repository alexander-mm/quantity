import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onNewCategory: () => void;
};

export function CategoriesToolbar({ onNewCategory }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewCategory}>
                <Plus size={18} />
                Nueva categoría
            </Button>
        </div>
    );
}
