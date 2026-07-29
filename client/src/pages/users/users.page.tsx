import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    UsersToolbar,
    UsersTable,
    UsersEmptyState,
    UserModal
} from "@/components";
import { useUsers } from "@/hooks";

export function UsersPage() {

    const { data, isLoading, isError } = useUsers();
    const users = data?.data ?? [];
    const [open, setOpen] = useState(false);

    return (
        <PageContainer>

            <PageHeader
                title="Usuarios"
                description="Crea y administra los usuarios que acceden al sistema."
            />

            <div className="mt-8">
                <UsersToolbar onNewUser={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los usuarios.</p>}
                {!isLoading && !isError && (
                    users.length === 0
                        ? <UsersEmptyState />
                        : <UsersTable users={users} />
                )}
            </div>

            <UserModal open={open} onOpenChange={setOpen} />

        </PageContainer>
    );
}
