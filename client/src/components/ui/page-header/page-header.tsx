import type { ReactNode } from "react";

import { cn } from "@/lib";

type PageHeaderProps = {

    title: string;

    description?: string;

    actions?: ReactNode;

    className?: string;

};

export function PageHeader({

    title,

    description,

    actions,

    className

}: PageHeaderProps) {

    return (

        <div

            className={cn(

                "flex",

                "flex-col",

                "gap-4",

                "md:flex-row",

                "md:items-center",

                "md:justify-between",

                className

            )}

        >

            <div>

                <h1

                    className="text-3xl font-bold tracking-tight"

                >

                    {title}

                </h1>

                {

                    description && (

                        <p

                            className="mt-1 text-sm text-muted-foreground"

                        >

                            {description}

                        </p>

                    )

                }

            </div>

            {

                actions && (

                    <div>

                        {actions}

                    </div>

                )

            }

        </div>

    );

}