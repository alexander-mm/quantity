import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { ProductComponentController } from "./product-component.controller.js";
import { setProductComponentsSchema } from "./product-component.validator.js";

const router = Router();

const controller = new ProductComponentController();

router.get(
    "/with-recipe",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.findProductIdsWithRecipe.bind(controller)
);

// Lectura abierta a cualquier rol autenticado: el formulario de Devoluciones
// necesita consultar la receta de un kit para dejar elegir qué componente
// devolver, incluso desde el rol Tienda.
router.get(
    "/:productId",
    authenticate,
    controller.findByProduct.bind(controller)
);

router.put(
    "/:productId",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(setProductComponentsSchema),
    controller.set.bind(controller)
);

export default router;
