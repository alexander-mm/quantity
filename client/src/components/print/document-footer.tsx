import { COMPANY_INFO } from "./company-info";

export function DocumentFooter() {
    return (
        <div className="mt-auto pt-6">
            <div className="h-px w-full bg-slate-200" />
            <div className="flex items-end justify-between gap-6 pt-4">
                <div className="text-[10px] leading-relaxed text-slate-400">
                    <p>{COMPANY_INFO.address}</p>
                    <p>
                        RUC/NIT: {COMPANY_INFO.taxId} · WhatsApp: {COMPANY_INFO.whatsapp} · {COMPANY_INFO.email}
                    </p>
                </div>
                <p className="shrink-0 text-2xl font-semibold tracking-tight text-[#0170B8]">
                    {COMPANY_INFO.website}
                </p>
            </div>
        </div>
    );
}
