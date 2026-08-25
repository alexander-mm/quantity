import {
    PageContainer,
    PageHeader,
    SuppliersToolbar,
    SuppliersTable,
    SuppliersTableSkeleton,
    SuppliersErrorState,
    SuppliersEmptyState,
    SupplierFormModal,
    DeleteSupplierDialog,
} from "@/components";

import { useState, useMemo } from "react";

import {
    useSuppliers,
    useDeleteSupplier
} from "@/hooks";

import type { Supplier } from "@/types";

export function SuppliersPage() {

    const { data, isLoading, isError } = useSuppliers();

    const supplierList = data?.data ?? [];

    const deleteSupplierMutation =
        useDeleteSupplier();

    const [search, setSearch] = useState("");

    const suppliers = useMemo(() => {
        const list = supplierList;
        if (!search) return list;
        const term = search.toLowerCase();
        return list.filter(s =>
            s.companyName.toLowerCase().includes(term) ||
            s.code.toLowerCase().includes(term) ||
            (s.contactName ?? "").toLowerCase().includes(term)
        );
    }, [supplierList, search]);

    const [open, setOpen] =
        useState(false);

    const [selectedSupplier, setSelectedSupplier] =
        useState<Supplier | null>(null);

    const [supplierToDelete, setSupplierToDelete] =
        useState<Supplier | null>(null);

    if (isLoading) {

        return (

            <PageContainer>

                <PageHeader
                    title="Proveedores"
                    description="Administra los proveedores del sistema."
                />

                <div className="mt-8">

                    <SuppliersToolbar
                        onNewSupplier={() => setOpen(true)}
                        suppliers={supplierList}
                        onSearchChange={setSearch}
                    />

                </div>

                <div className="mt-6">

                    <SuppliersTableSkeleton />

                </div>

            </PageContainer>

        );

    }

    if (isError) {

        return (

            <PageContainer>

                <PageHeader
                    title="Proveedores"
                    description="Administra los proveedores del sistema."
                />

                <div className="mt-6">

                    <SuppliersErrorState />

                </div>

            </PageContainer>

        );

    }

    return (

        <PageContainer>

            <PageHeader
                title="Proveedores"
                description="Administra los proveedores del sistema."
            />

            <div className="mt-8">

                <SuppliersToolbar
                    onNewSupplier={() => setOpen(true)}
                    suppliers={supplierList}
                    onSearchChange={setSearch}
                />

            </div>

            <div className="mt-6">

                {

                    suppliers.length === 0

                        ? (

                            <SuppliersEmptyState />

                        )

                        : (

                            <>

                                <SuppliersTable

                                    suppliers={suppliers}

                                    onEdit={(supplier) => {

                                        setSelectedSupplier(
                                            supplier
                                        );

                                        setOpen(true);

                                    }}

                                    onDelete={(supplier) => {

                                        setSupplierToDelete(
                                            supplier
                                        );

                                    }}

                                />

                                <p className="mt-4 text-sm text-muted-foreground">

                                    Mostrando {suppliers.length} proveedores

                                </p>

                            </>

                        )

                }

            </div>

            <SupplierFormModal

                open={open}

                onOpenChange={(value) => {

                    setOpen(value);

                    if (!value) {

                        setSelectedSupplier(null);

                    }

                }}

                mode={
                    selectedSupplier
                        ? "edit"
                        : "create"
                }

                supplierId={selectedSupplier?.id}

            />

            <DeleteSupplierDialog

                open={!!supplierToDelete}

                supplierName={
                    supplierToDelete?.companyName ?? ""
                }

                onCancel={() => {

                    setSupplierToDelete(null);

                }}

                onConfirm={() => {

                    if (!supplierToDelete) {

                        return;

                    }

                    deleteSupplierMutation.mutate(

                        supplierToDelete.id,

                        {

                            onSuccess: () => {

                                setSupplierToDelete(null);

                            }

                        }

                    );

                }}

            />

        </PageContainer>

    );

}