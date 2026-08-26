import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    pageSize: number;
};

export function PaginationControls({ page, totalPages, onPageChange, totalItems, pageSize }: Props) {

    if (totalItems === 0) {
        return null;
    }

    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, totalItems);

    return (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">

            <p>Mostrando {from}-{to} de {totalItems} registros</p>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft size={16} />
                </Button>
                <span>Página {page} de {totalPages}</span>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    <ChevronRight size={16} />
                </Button>
            </div>

        </div>
    );
}
