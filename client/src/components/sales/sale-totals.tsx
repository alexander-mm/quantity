import { formatCurrency } from "@/lib/format-currency";

type Props={
    subtotal:number;
    discount:number;
    tax:number;
    total:number;
    currency?:"USD"|"COP";
};

export function SaleTotals({
    subtotal,
    discount,
    tax,
    total,
    currency="USD"
}:Props){

    return(

        <div className="ml-auto w-full max-w-sm rounded-lg border p-4">

            <div className="flex justify-between py-1">
                <span>
                    Subtotal
                </span>
                <strong>
                    {formatCurrency(subtotal,currency)}
                </strong>
            </div>

            <div className="flex justify-between py-1">
                <span>
                    Descuento
                </span>
                <strong>
                    {formatCurrency(discount,currency)}
                </strong>
            </div>

            <div className="flex justify-between py-1">
                <span>
                    IVA
                </span>
                <strong>
                    {formatCurrency(tax,currency)}
                </strong>
            </div>

            <div className="mt-3 flex justify-between border-t pt-3 text-lg font-semibold">
                <span>
                    Total
                </span>

                <span>
                    {formatCurrency(total,currency)}
                </span>
            </div>
        </div>
    );
}