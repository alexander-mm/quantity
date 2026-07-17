import { format } from "date-fns";

import {

    Card,

    CardContent,

    CardHeader,

    CardTitle

} from "@/components";

type Movement = {

    quantity: string;

    movementDate: string;

    movementType: {

        name: string;

    };

    product: {

        name: string;

    };

    user: {

        firstName: string;

        lastName: string;

    };

};

type DashboardRecentMovementsProps = {

    movements: Movement[];

};

export function DashboardRecentMovements({

    movements

}: DashboardRecentMovementsProps) {

    return (

        <Card>

            <CardHeader>

                <CardTitle>

                    Últimos movimientos

                </CardTitle>

            </CardHeader>

            <CardContent>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead>

                            <tr className="border-b text-left text-muted-foreground">

                                <th className="pb-3 font-medium">

                                    Tipo

                                </th>

                                <th className="pb-3 font-medium">

                                    Producto

                                </th>

                                <th className="pb-3 font-medium">

                                    Usuario

                                </th>

                                <th className="pb-3 text-center font-medium">

                                    Cantidad

                                </th>

                                <th className="pb-3 text-right font-medium">

                                    Fecha

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {movements.map((movement, index) => (

                                <tr

                                    key={index}

                                    className="border-b last:border-none hover:bg-muted/40"

                                >

                                    <td className="py-3">

                                        {movement.movementType.name}

                                    </td>

                                    <td className="py-3">

                                        {movement.product.name}

                                    </td>

                                    <td className="py-3">

                                        {movement.user.firstName}{" "}

                                        {movement.user.lastName}

                                    </td>

                                    <td className="py-3 text-center">

                                        {movement.quantity}

                                    </td>

                                    <td className="py-3 text-right">

                                        {format(

                                            new Date(movement.movementDate),

                                            "dd/MM/yyyy"

                                        )}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </CardContent>

        </Card>

    );

}