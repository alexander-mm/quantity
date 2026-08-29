import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    UsersToolbar,
    UsersTable,
    UsersEmptyState,
    UserModal,
    DeleteUserDialog,
    SetAttendancePinModal
} from "@/components";
import { useUsers, useDeleteUser } from "@/hooks";
import type { User } from "@/types";
import { LoadingState } from "@/components/ui/spinner";

export function UsersPage() {

    const { data, isLoading, isError } = useUsers();
    const deleteMutation = useDeleteUser();
    const users = data?.data ?? [];
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [userToSetPin, setUserToSetPin] = useState<User | null>(null);

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
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar los usuarios.</p>}
                {!isLoading && !isError && (
                    users.length === 0
                        ? <UsersEmptyState />
                        : (
                            <UsersTable
                                users={users}
                                onEdit={(user) => {
                                    setSelectedUser(user);
                                    setOpen(true);
                                }}
                                onDelete={(user) => {
                                    setUserToDelete(user);
                                }}
                                onSetPin={(user) => {
                                    setUserToSetPin(user);
                                }}
                            />
                        )
                )}
            </div>

            <SetAttendancePinModal
                open={!!userToSetPin}
                user={userToSetPin}
                onOpenChange={(value) => {
                    if (!value) {
                        setUserToSetPin(null);
                    }
                }}
            />

            <UserModal
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setSelectedUser(null);
                    }
                }}
                mode={selectedUser ? "edit" : "create"}
                userId={selectedUser?.id}
            />

            <DeleteUserDialog
                open={!!userToDelete}
                userName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : ""}
                onCancel={() => setUserToDelete(null)}
                onConfirm={() => {
                    if (!userToDelete) {
                        return;
                    }
                    deleteMutation.mutate(userToDelete.id, {
                        onSuccess: () => setUserToDelete(null)
                    });
                }}
            />

        </PageContainer>
    );
}
