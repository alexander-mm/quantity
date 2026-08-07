import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
    PageContainer,
    PageHeader,
    PartsRecipeTable,
    PartRecipeModal
} from "@/components";
import { Input } from "@/components/ui/input";
import { useParts } from "@/hooks";
import type { Part } from "@/types";

export function PartRecipesPage() {

    const { data, isLoading, isError } = useParts();
    const [search, setSearch] = useState("");
    const [partToEdit, setPartToEdit] = useState<Part | null>(null);

    const parts = useMemo(() => {

        const list = data?.data ?? [];

        if (!search) {
            return list;
        }

        const term = search.toLowerCase();

        return list.filter(part =>
            part.name.toLowerCase().includes(term) ||
            part.code.toLowerCase().includes(term)
        );

    }, [data, search]);

    return (
        <PageContainer>

            <PageHeader
                title="Recetas de corte"
                description="Define de qué lámina, tubo o varilla se corta cada pieza y cuántas salen por unidad."
            />

            <div className="mt-8 relative w-full max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar pieza..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar las piezas.</p>}
                {!isLoading && !isError && (
                    <PartsRecipeTable
                        parts={parts}
                        onEditRecipe={(part) => setPartToEdit(part)}
                    />
                )}
            </div>

            <PartRecipeModal
                open={!!partToEdit}
                part={partToEdit}
                onOpenChange={(value) => {
                    if (!value) {
                        setPartToEdit(null);
                    }
                }}
            />

        </PageContainer>
    );
}
