import type { LucideIcon } from "lucide-react";

import {

    Card,

    CardContent

} from "@/components";

import { cn } from "@/lib";

type StatCardProps = {

    title: string;

    value: string | number;

    description?: string;

    icon: LucideIcon;

    className?: string;

};

export function StatCard({

    title,

    value,

    description,

    icon: Icon,

    className

}: StatCardProps) {

    return (

        <Card className={cn("overflow-hidden", className)}>

            <CardContent className="p-6">

                <div className="flex items-start justify-between">

                    <div>

                        <p className="text-sm font-medium text-muted-foreground">

                            {title}

                        </p>

                        {

                            description && (

                                <p className="mt-1 text-xs text-muted-foreground">

                                    {description}

                                </p>

                            )

                        }

                    </div>

                    <div className="rounded-lg bg-primary/10 p-3">

                        <Icon

                            className="h-5 w-5 text-primary"

                        />

                    </div>

                </div>

                <h2 className="mt-6 text-4xl font-bold tracking-tight">

                    {value}

                </h2>

            </CardContent>

        </Card>

    );

}