import { cn } from "@/lib/utils";

const BRAND_BLUE = "#0170B8";

type SpinnerProps = {
    className?: string;
    size?: number;
};

export function Spinner({ className, size = 32 }: SpinnerProps) {
    return (
        <div
            role="status"
            aria-label="Cargando"
            className={cn("animate-spin rounded-full border-4 border-slate-200", className)}
            style={{ width: size, height: size, borderTopColor: BRAND_BLUE }}
        />
    );
}

type LoadingStateProps = {
    label?: string;
    className?: string;
};

export function LoadingState({ label, className }: LoadingStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-3 py-10", className)}>
            <Spinner />
            {label && <p className="text-sm text-muted-foreground">{label}</p>}
        </div>
    );
}
