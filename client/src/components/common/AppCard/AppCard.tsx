import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ReactNode } from "react";

interface AppCardProps {
  title?: string;
  children: ReactNode;
}

export function AppCard({ title, children }: AppCardProps) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}

      <CardContent>{children}</CardContent>
    </Card>
  );
}