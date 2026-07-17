import type { HTMLAttributes } from "react";

import { cn } from "@/lib";

type PageContainerProps = HTMLAttributes<HTMLDivElement>;

export function PageContainer({

    className,

    ...props

}: PageContainerProps) {

    return (

        <div

            className={cn(

                "mx-auto",

                "w-full",

                "max-w-7xl",

                "space-y-6",

                "p-6",

                className

            )}

            {...props}

        />

    );

}