import { Pencil, Eye, Trash2 } from "lucide-react";

import { EntityTable } from "@/components";

type Product = {

    id: string;

    internalCode: string;

    name: string;

    brand: {

        name: string;

    };

    category: {

        name: string;

    };

    stock: string;

    isActive: boolean;

};

type ProductsTableProps = {

    products: Product[];

};

export function ProductsTable({

    products

}: ProductsTableProps) {

    return (

        <EntityTable

            headers={[

                "Código",

                "Producto",

                "Marca",

                "Categoría",

                "Stock",

                "Estado",

                "Acciones"

            ]}

        >

            {

                products.map(product => (

                    <tr

                        key={product.id}

                        className="border-b hover:bg-muted/40"

                    >

                        <td className="px-6 py-4">

                            {product.internalCode}

                        </td>

                        <td className="px-6 py-4 font-medium">

                            {product.name}

                        </td>

                        <td className="px-6 py-4">

                            {product.brand.name}

                        </td>

                        <td className="px-6 py-4">

                            {product.category.name}

                        </td>

                        <td className="px-6 py-4">

                            {product.stock}

                        </td>

                        <td className="px-6 py-4">

                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">

                                {product.isActive ? "Activo" : "Inactivo"}

                            </span>

                        </td>

                        <td className="px-6 py-4">

                            <div className="flex gap-3">

                                <Eye
                                    size={18}
                                    className="cursor-pointer"
                                />

                                <Pencil
                                    size={18}
                                    className="cursor-pointer"
                                />

                                <Trash2
                                    size={18}
                                    className="cursor-pointer text-red-500"
                                />

                            </div>

                        </td>

                    </tr>

                ))

            }

        </EntityTable>

    );

}