export interface Category {

    id: string;

    uuid: string;

    name: string;

    description: string | null;

    parentCategoryId: string | null;

    stockMultiplier: string;

    isActive: boolean;

}