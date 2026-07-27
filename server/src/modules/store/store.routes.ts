import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { StoreController } from "./store.controller.js";
import { createStoreSchema } from "./store.validator.js";

const router = Router();
const controller = new StoreController();

router.get(
    "/",
    authenticate,
    controller.findAll.bind(controller)
);

router.get(
    "/:id",
    authenticate,
    controller.findById.bind(controller)
);

router.post(
    "/",
    authenticate,
    validate(createStoreSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    authenticate,
    validate(createStoreSchema),
    controller.update.bind(controller)
);

router.delete(
    "/:id",
    authenticate,
    controller.delete.bind(controller)
);

export default router;