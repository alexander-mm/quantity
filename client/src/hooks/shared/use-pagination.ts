import { useEffect, useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize = 20) {

    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

    // Si un filtro reduce la lista y la página actual queda fuera de rango,
    // vuelve a la última página válida en vez de mostrar una tabla vacía.
    useEffect(() => {

        if (page > totalPages) {
            setPage(totalPages);
        }

    }, [page, totalPages]);

    const pageItems = useMemo(
        () => items.slice((page - 1) * pageSize, page * pageSize),
        [items, page, pageSize]
    );

    return {
        page,
        setPage,
        totalPages,
        pageItems,
        pageSize,
        totalItems: items.length
    };

}
