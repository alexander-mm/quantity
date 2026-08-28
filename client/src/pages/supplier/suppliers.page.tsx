import {
    PageContainer,
    PageHeader,
    SuppliersToolbar,
    SuppliersTable,
    SuppliersTableSkeleton,
    SuppliersErrorState,
    SuppliersEmptyState,
    SupplierFormModal,
    SupplierViewModal,
    DeleteSupplierDialog,
} from "@/components";

import { useState, useMemo } from "react";

import { PaginationControls } from "@/components/ui";

import {
    useSuppliers,
    useDeleteSupplier,
    usePagination
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

    const { pageItems: pagedSuppliers, page, setPage, totalPages, totalItems, pageSize } = usePagination(suppliers);

    const [open, setOpen] =
        useState(false);

    const [selectedSupplier, setSelectedSupplier] =
        useState<Supplier | null>(null);

    const [supplierToDelete, setSupplierToDelete] =
        useState<Supplier | null>(null);

    const [supplierToView, setSupplierToView] =
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

                                    suppliers={pagedSuppliers}

                                    onView={(supplier) => {

                                        setSupplierToView(
                                            supplier
                                        );

                                    }}

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

                                <PaginationControls
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    totalItems={totalItems}
                                    pageSize={pageSize}
                                />

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

            <SupplierViewModal

                open={!!supplierToView}

                supplier={supplierToView}

                onOpenChange={(value) => {

                    if (!value) {

                        setSupplierToView(null);

                    }

                }}

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