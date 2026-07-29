import { useState } from "react";
import {
    PageContainer, PageHeader, RolesToolbar, RolesTable,
    RolesEmptyState, RoleModal, DeactivateRoleDialog
} from "@/components";
import { useRoles, useDeleteRole } from "@/hooks";
import type { Role } from "@/types";

export function RolesPage() {

    const { data, isLoading, isError } = useRoles();
    const deactivateMutation = useDeleteRole();
    const roles = data?.data ?? [];
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roleToDeactivate, setRoleToDeactivate] = useState<Role | null>(null);

    return (
        <PageContainer>
            <PageHeader title="Roles" description="Crea y administra los roles del sistema." />

            <div className="mt-8">
                <RolesToolbar onNewRole={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <p>Cargando...</p>}
                {isError && <p>Error al cargar los roles.</p>}
                {!isLoading && !isError && (
                    roles.length === 0
                        ? <RolesEmptyState />
                        : (
                            <RolesTable
                                roles={roles}
                                onEdit={(role) => { setSelectedRole(role); setOpen(true); }}
                                onDeactivate={(role) => setRoleToDeactivate(role)}
                            />
                        )
                )}
            </div>

            <RoleModal
                open={open}
                onOpenChange={(value) => { setOpen(value); if (!value) setSelectedRole(null); }}
                mode={selectedRole ? "edit" : "create"}
                roleId={selectedRole?.id}
            />

            <DeactivateRoleDialog
                open={!!roleToDeactivate}
                roleName={roleToDeactivate?.name ?? ""}
                onCancel={() => setRoleToDeactivate(null)}
                onConfirm={() => {
                    if (!roleToDeactivate) return;
                    deactivateMutation.mutate(roleToDeactivate.id, {
                        onSuccess: () => setRoleToDeactivate(null)
                    });
                }}
            />
        </PageContainer>
    );
}
