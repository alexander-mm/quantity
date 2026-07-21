import { Eye, Pencil, Trash2 } from "lucide-react";

import { EntityTable } from "@/components/ui";

type Product = {

    id: string;

    internalCode: string;

    name: string;

    price: string | null;

    isActive: boolean;

    brand: {

        name: string;

    };

    category: {

        name: string;

    };

};

type Props = {

    products: Product[];

};

export function ProductsTable({

    products

}: Props) {

    return (

        <EntityTable

            headers={[

                "Código",

                "Producto",

                "Marca",

                "Categoría",

                "Precio",

                "Estado",

                "Acciones"

            ]}

        >

            {

                products.map(product => (

                    <tr

                        key={product.id}

                        className="border-b transition hover:bg-muted/40"

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

                            {
                                product.price
                                    ? `$${Number(product.price).toLocaleString()}`
                                    : "-"
                            }
                        </td>

                        <td className="px-6 py-4">

                            <span

                                className={`rounded-full px-3 py-1 text-xs font-medium ${product.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}

                            >

                                {product.isActive ? "Activo" : "Inactivo"}

                            </span>

                        </td>

                        <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                                <Eye
                                    size={18}
                                    className="cursor-pointer text-slate-500 hover:text-primary"
                                />

                                <Pencil
                                    size={18}
                                    className="cursor-pointer text-slate-500 hover:text-primary"
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