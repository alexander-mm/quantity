import { Input } from "../../ui/input";

import type { ComponentProps } from "react";

type AppInputProps = ComponentProps<typeof Input>;

export function AppInput(props: AppInputProps) {
  return <Input {...props} />;
}