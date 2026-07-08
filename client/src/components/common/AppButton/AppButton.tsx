import { Button } from "@/components/ui/button";

import type { ComponentProps } from "react";

type AppButtonProps = ComponentProps<typeof Button>;

export function AppButton(props: AppButtonProps) {
  return <Button {...props} />;
}