import { Card, CardContent } from "@/components";

export function ProductsTableSkeleton() {

    return (

        <Card>

            <CardContent className="p-6">

                <div className="space-y-4">

                    {Array.from({ length: 6 }).map((_, index) => (

                        <div
                            key={index}
                            className="h-12 animate-pulse rounded-lg bg-muted"
                        />

                    ))}

                </div>

            </CardContent>

        </Card>

    );

}