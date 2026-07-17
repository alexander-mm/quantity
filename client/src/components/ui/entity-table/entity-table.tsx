import type { ReactNode } from "react";

type EntityTableProps = {

    headers: string[];

    children: ReactNode;

};

export function EntityTable({

    headers,

    children

}: EntityTableProps) {

    return (

        <div className="overflow-hidden rounded-xl border bg-card">

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-muted/50">

                        <tr>

                            {headers.map(header => (

                                <th
                                    key={header}
                                    className="px-6 py-4 text-left text-sm font-semibold"
                                >

                                    {header}

                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {children}

                    </tbody>

                </table>

            </div>

        </div>

    );

}