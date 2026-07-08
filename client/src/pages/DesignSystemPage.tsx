import { AppButton } from "@/components/common";
import { AppCard } from "@/components/common";
import { AppInput } from "@/components/common/AppInput/AppInput";

export function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-5xl space-y-8">

        <h1 className="text-3xl font-bold">
          Design System
        </h1>

        <AppCard title="Buttons">
          <div className="flex gap-4">
            <AppButton>Primary</AppButton>

            <AppButton variant="secondary">
              Secondary
            </AppButton>

            <AppButton variant="outline">
              Outline
            </AppButton>

            <AppButton disabled>
              Disabled
            </AppButton>
          </div>
        </AppCard>

        <AppCard title="Inputs">
          <div className="space-y-4">
            <AppInput placeholder="Usuario" />

            <AppInput
              type="password"
              placeholder="Contraseña"
            />
          </div>
        </AppCard>

      </div>
    </main>
  );
}