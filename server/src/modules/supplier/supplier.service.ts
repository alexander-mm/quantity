import { Supplier } from "@prisma/client";
import { CreateSupplierDto, UpdateSupplierDto } from "./supplier.dto.js";
import { SupplierRepository } from "./supplier.repository.js";
import { ConflictError, NotFoundError } from "../../shared/errors/index.js";

export class SupplierService{

    private readonly repository=new SupplierRepository();

    async findAll():Promise<Supplier[]>{
        return this.repository.findAll();
    }

    async findById(
        id:string
    ):Promise<Supplier>{
        const supplier=await this.repository.findById(
            BigInt(id)
        );
        if(!supplier){
            throw new NotFoundError(
                "Proveedor no encontrado."
            );
        }
        return supplier;
    }

    async create(
        data:CreateSupplierDto
    ):Promise<Supplier>{

        const existing=await this.repository.findByCode(
            data.code
        );

        if(existing){
            throw new ConflictError(
                "Ya existe un proveedor con ese código."
            );
        }

        return this.repository.create(data);

    }

    async update(
        id:string,
        data:UpdateSupplierDto
    ):Promise<Supplier>{

        const supplier=await this.repository.findById(
            BigInt(id)
        );

        if(!supplier){
            throw new NotFoundError(
                "Proveedor no encontrado."
            );
        }

        const existing=await this.repository.findByCode(
            data.code
        );

        if(
            existing &&
            existing.id!==BigInt(id)
        ){
            throw new ConflictError(
                "Ya existe un proveedor con ese código."
            );
        }

        return this.repository.update(
            BigInt(id),
            data
        );

    }

    async delete(
        id:string
    ):Promise<void>{

        const supplier=await this.repository.findById(
            BigInt(id)
        );

        if(!supplier){
            throw new NotFoundError(
                "Proveedor no encontrado."
            );
        }

        await this.repository.delete(
            BigInt(id)
        );

    }

}