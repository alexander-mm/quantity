import { RequestHandler } from "express";
import { ZodSchema } from "zod";

export function validate(schema: ZodSchema): RequestHandler {

    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            res.status(400).json({

                success: false,

                errors: result.error.flatten()

            });

            return;

        }

        req.body = result.data;

        next();

    };

}