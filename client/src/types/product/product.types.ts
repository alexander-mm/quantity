export interface Product {

    id: string;

    uuid: string;

    internalCode: string;

    barcode: string | null;

    name: string;

    description: string | null;

    brandId: string;

    categoryId: string;

    unitOfMeasureId: string;

    marginProfileId: string;

    costPrice: string;

    salePrice: string;

    minimumStock: string;

    isActive: boolean;

}
