import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";

import { EquipmentPartController } from "./equipment-part.controller.js";
import { setEquipmentPartsSchema } from "./equipment-part.validator.js";

const router = Router();

const controller = new EquipmentPartController();

router.get(
    "/preview/:productId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    controller.preview.bind(controller)
);

// Lectura abierta a cualquier rol autenticado: el formulario de Devoluciones
// necesita consultar la receta de un kit para dejar elegir qué pieza
// devolver, incluso desde el rol Tienda.
router.get(
    "/:productId",
    authenticate,
    controller.findByProduct.bind(controller)
);

router.put(
    "/:productId",
    authenticate,
    authorize(ROLES.ADMIN, ROLES.PRODUCTION),
    validate(setEquipmentPartsSchema),
    controller.set.bind(controller)
);

export default router;
