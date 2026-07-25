import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SuppliersToolbarProps = {

    onNewSupplier: () => void;

};

export function SuppliersToolbar({

    onNewSupplier

}: SuppliersToolbarProps) {

    return (

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="relative w-full max-w-md">

                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                />

                <Input
                    placeholder="Buscar proveedor..."
                    className="pl-10"
                />

            </div>

            <Button
                onClick={onNewSupplier}
            >

                <Plus size={18} />

                Nuevo proveedor

            </Button>

        </div>

    );

}