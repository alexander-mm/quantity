export interface CreateSupplierDto{
    code:string;
    companyName:string;
    contactName?:string;
    taxId?:string;
    phone?:string;
    email?:string;
    address?:string;
    city?:string;
    observations?:string;
}
export interface UpdateSupplierDto{
    code:string;
    companyName:string;
    contactName?:string;
    taxId?:string;
    phone?:string;
    email?:string;
    address?:string;
    city?:string;
    observations?:string;
}