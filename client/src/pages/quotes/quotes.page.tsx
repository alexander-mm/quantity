import { useMemo, useState } from "react";
import { PageContainer, PageHeader, QuotesToolbar, QuotesTable, QuoteModal, QuoteViewModal } from "@/components";
import { PaginationControls } from "@/components/ui";
import { useQuotes, usePagination } from "@/hooks";
import { getClientLabel } from "@/lib/client-label";
import type { Quote } from "@/types";

export function QuotesPage() {

    const { data, isLoading, isError } = useQuotes();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [quoteToView, setQuoteToView] = useState<Quote | null>(null);

    const quotes = useMemo(() => {

        const list = data?.data ?? [];

        if (!search) {
            return list;
        }

        const term = search.toLowerCase();

        return list.filter(quote =>
            quote.number.toLowerCase().includes(term) ||
            getClientLabel(quote.client).toLowerCase().includes(term)
        );

    }, [data, search]);

    const { pageItems: pagedQuotes, page, setPage, totalPages, totalItems, pageSize } = usePagination(quotes);

    return (
        <PageContainer>

            <PageHeader
                title="Cotizaciones"
                description="Arma y envía cotizaciones a tus clientes."
            />

            <div className="mt-8">
                <QuotesToolbar
                    onNewQuote={() => setOpen(true)}
                    search={search}
                    onSearchChange={setSearch}
                />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p className="text-red-500">Error al cargar las cotizaciones.</p>}
                {!isLoading && !isError && (
                    quotes.length === 0
                        ? <p className="text-muted-foreground">No hay cotizaciones registradas.</p>
                        : (
                            <>
                                <QuotesTable quotes={pagedQuotes} onView={(quote) => setQuoteToView(quote)} />
                                <PaginationControls
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    totalItems={totalItems}
                                    pageSize={pageSize}
                                />
                            </>
                        )
                )}
            </div>

            <QuoteModal open={open} onOpenChange={setOpen} />

            <QuoteViewModal
                open={!!quoteToView}
                quote={quoteToView}
                onOpenChange={(value) => { if (!value) setQuoteToView(null); }}
            />

        </PageContainer>
    );
}
