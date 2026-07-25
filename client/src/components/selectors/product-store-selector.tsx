import { Button } from "@/components/ui/button";
import { ProductSelector } from "./product-selector";
import { StoreSelector } from "./store-selector";
import type { Product, Store } from "@/types";

type Props={
    products:Product[];
    stores:Store[];
    productId:string;
    storeId:string;
    onProductChange:(value:string|null)=>void;
    onStoreChange:(value:string|null)=>void;
    onSearch:()=>void;
};

export function ProductStoreSelector({
    products,
    stores,
    productId,
    storeId,
    onProductChange,
    onStoreChange,
    onSearch
}:Props){
    return(
        <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-end">
            <ProductSelector
                products={products}
                value={productId}
                onChange={onProductChange}
            />
            <StoreSelector
                stores={stores}
                value={storeId}
                onChange={onStoreChange}
            />
            <Button onClick={onSearch}>
                Consultar
            </Button>
        </div>
    );
}