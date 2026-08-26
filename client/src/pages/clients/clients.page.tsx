import { useMemo, useState } from "react";
import {
    PageContainer,
    PageHeader,
    ClientsToolbar,
    ClientsTable,
    ClientsEmptyState,
    ClientModal,
    DeleteClientDialog
} from "@/components";
import { PaginationControls } from "@/components/ui";
import { useClients, useDeleteClient, usePagination } from "@/hooks";
import type { Client } from "@/types";

function getClientLabel(client: Client) {
    return client.companyName
        ?? ([client.firstName, client.lastName].filter(Boolean).join(" ")
            || client.document);
}

export function ClientsPage() {

    const { data, isLoading, isError } = useClients();
    const deleteMutation = useDeleteClient();
    const [open, setOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [search, setSearch] = useState("");

    const clients = useMemo(() => {

        const list = data?.data ?? [];

        if (!search) {
            return list;
        }

        const term = search.toLowerCase();

        return list.filter(client =>
            getClientLabel(client).toLowerCase().includes(term) ||
            client.document.toLowerCase().includes(term)
        );

    }, [data, search]);

    const { pageItems: pagedClients, page, setPage, totalPages, totalItems, pageSize } = usePagination(clients);

    return (
        <PageContainer>

            <PageHeader
                title="Admin. de Clientes"
                description="Administra los clientes y sus descuentos especiales."
            />

            <div className="mt-8">
                <ClientsToolbar
                    onNewClient={() => setOpen(true)}
                    search={search}
                    onSearchChange={setSearch}
                />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los clientes.</p>}
                {!isLoading && !isError && (
                    clients.length === 0
                        ? <ClientsEmptyState />
                        : (
                            <>
                                <ClientsTable
                                    clients={pagedClients}
                                    onEdit={(client) => {
                                        setSelectedClient(client);
                                        setOpen(true);
                                    }}
                                    onDelete={(client) => setClientToDelete(client)}
                                />
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

            <ClientModal
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setSelectedClient(null);
                    }
                }}
                mode={selectedClient ? "edit" : "create"}
                clientId={selectedClient?.id}
            />

            <DeleteClientDialog
                open={!!clientToDelete}
                clientName={clientToDelete ? getClientLabel(clientToDelete) : ""}
                onCancel={() => setClientToDelete(null)}
                onConfirm={() => {
                    if (!clientToDelete) {
                        return;
                    }
                    deleteMutation.mutate(clientToDelete.id, {
                        onSuccess: () => setClientToDelete(null)
                    });
                }}
            />

        </PageContainer>
    );
}
