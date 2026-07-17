import { Search, Plus } from "lucide-react";

export function ProductsToolbar() {

    return (

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="relative w-full max-w-md">

                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                />

                <input
                    placeholder="Buscar producto..."
                    className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary"
                />

            </div>

            <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >

                <Plus size={18} />

                Nuevo producto

            </button>

        </div>

    );

}