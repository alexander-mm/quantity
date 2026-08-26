import logo from "@/assets/brand/ordeplus-logo-blue.png";
import { COMPANY_INFO } from "./company-info";

type Props = {
    documentTitle: string;
    documentNumber: string;
};

export function DocumentLetterhead({ documentTitle, documentNumber }: Props) {
    return (
        <div>
            <div className="flex items-end justify-between gap-6">
                <img src={logo} alt={COMPANY_INFO.name} className="h-9 w-auto" />
                <div className="text-right">
                    <p className="text-sm font-medium tracking-[0.2em] text-slate-400 uppercase">
                        {documentTitle}
                    </p>
                    <p className="text-2xl font-semibold text-[#0170B8]">
                        N° {documentNumber}
                    </p>
                </div>
            </div>
            <div className="mt-4 h-[3px] w-full bg-[#0170B8]" />
        </div>
    );
}
