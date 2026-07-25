type Props={

    subtotal:number;
    discount:number;
    tax:number;
    total:number;

};

export function SaleTotals({

    subtotal,
    discount,
    tax,
    total

}:Props){

    return(

        <div className="ml-auto w-full max-w-sm rounded-lg border p-4">

            <div className="flex justify-between py-1">

                <span>
                    Subtotal
                </span>

                <strong>

                    $
                    {subtotal.toFixed(2)}

                </strong>

            </div>

            <div className="flex justify-between py-1">

                <span>
                    Descuento
                </span>

                <strong>

                    $
                    {discount.toFixed(2)}

                </strong>

            </div>

            <div className="flex justify-between py-1">

                <span>
                    IVA
                </span>

                <strong>

                    $
                    {tax.toFixed(2)}

                </strong>

            </div>

            <div className="mt-3 flex justify-between border-t pt-3 text-lg font-semibold">

                <span>
                    Total
                </span>

                <span>

                    $
                    {total.toFixed(2)}

                </span>

            </div>

        </div>

    );

}
