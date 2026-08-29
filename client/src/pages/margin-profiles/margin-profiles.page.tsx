import { useState } from "react";
import {
    PageContainer,
    PageHeader,
    MarginProfilesToolbar,
    MarginProfilesTable,
    MarginProfilesEmptyState,
    MarginProfileModal,
    DeleteMarginProfileDialog
} from "@/components";
import { useMarginProfiles, useDeleteMarginProfile } from "@/hooks";
import type { MarginProfile } from "@/types";
import { LoadingState } from "@/components/ui/spinner";

export function MarginProfilesPage() {

    const { data, isLoading, isError } = useMarginProfiles();
    const deleteMutation = useDeleteMarginProfile();
    const profiles = data?.data ?? [];
    const [open, setOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<MarginProfile | null>(null);
    const [profileToDelete, setProfileToDelete] = useState<MarginProfile | null>(null);

    return (
        <PageContainer>

            <PageHeader
                title="Perfiles de margen"
                description="Administra los perfiles de descuento usados para calcular precios de venta."
            />

            <div className="mt-8">
                <MarginProfilesToolbar onNewProfile={() => setOpen(true)} />
            </div>

            <div className="mt-6">
                {isLoading && <LoadingState />}
                {isError && <p>Error al cargar los perfiles de margen.</p>}
                {!isLoading && !isError && (
                    profiles.length === 0
                        ? <MarginProfilesEmptyState />
                        : (
                            <MarginProfilesTable
                                profiles={profiles}
                                onEdit={(profile) => {
                                    setSelectedProfile(profile);
                                    setOpen(true);
                                }}
                                onDelete={(profile) => {
                                    setProfileToDelete(profile);
                                }}
                            />
                        )
                )}
            </div>

            <MarginProfileModal
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                    if (!value) {
                        setSelectedProfile(null);
                    }
                }}
                mode={selectedProfile ? "edit" : "create"}
                profileId={selectedProfile?.id}
            />

            <DeleteMarginProfileDialog
                open={!!profileToDelete}
                profileName={profileToDelete?.name ?? ""}
                onCancel={() => setProfileToDelete(null)}
                onConfirm={() => {
                    if (!profileToDelete) {
                        return;
                    }
                    deleteMutation.mutate(profileToDelete.id, {
                        onSuccess: () => setProfileToDelete(null)
                    });
                }}
            />

        </PageContainer>
    );
}
