import { NextFunction, Request, Response } from "express";
import { SupplierService } from "./supplier.service.js";
import { ApiResponse } from "../../shared/responses/index.js";

export class SupplierController{

    private readonly service=new SupplierService();

    async findAll(
        _req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
            const suppliers=await this.service.findAll();
            res.status(200).json(
                ApiResponse.success(
                    "Proveedores obtenidos correctamente.",
                    suppliers
                )
            );
        }catch(error){
            next(error);
        }
    }

    async findById(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
            const {id}=req.params;

            if(!id||Array.isArray(id)){
                res.status(400).json(
                    ApiResponse.error(
                        "Id inválido."
                    )
                );
                return;
            }

            const supplier=await this.service.findById(id);

            res.status(200).json(
                ApiResponse.success(
                    "Proveedor obtenido correctamente.",
                    supplier
                )
            );

        }catch(error){
            next(error);
        }
    }

    async create(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
            const supplier=await this.service.create(
                req.body
            );

            res.status(201).json(
                ApiResponse.success(
                    "Proveedor creado correctamente.",
                    supplier
                )
            );

        }catch(error){
            next(error);
        }
    }

    async update(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
            const {id}=req.params;

            if(!id||Array.isArray(id)){
                res.status(400).json(
                    ApiResponse.error(
                        "Id inválido."
                    )
                );
                return;
            }

            const supplier=await this.service.update(
                id,
                req.body
            );

            res.status(200).json(
                ApiResponse.success(
                    "Proveedor actualizado correctamente.",
                    supplier
                )
            );

        }catch(error){
            next(error);
        }
    }

    async delete(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
            const {id}=req.params;

            if(!id||Array.isArray(id)){
                res.status(400).json(
                    ApiResponse.error(
                        "Id inválido."
                    )
                );
                return;
            }

            await this.service.delete(id);

            res.status(200).json(
                ApiResponse.success(
                    "Proveedor eliminado correctamente."
                )
            );

        }catch(error){
            next(error);
        }
    }

}