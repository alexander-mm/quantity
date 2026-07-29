import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onNewUser: () => void;
};

export function UsersToolbar({ onNewUser }: Props) {
    return (
        <div className="flex justify-end">
            <Button onClick={onNewUser}>
                <Plus size={18} />
                Nuevo usuario
            </Button>
        </div>
    );
}
