import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { StoreController } from "./store.controller.js";
import { createStoreSchema } from "./store.validator.js";

const router = Router();
const controller = new StoreController();

router.get(
    "/",
    controller.findAll.bind(controller)
);

router.get(
    "/:id",
    controller.findById.bind(controller)
);

router.post(
    "/",
    validate(createStoreSchema),
    controller.create.bind(controller)
);

router.put(
    "/:id",
    validate(createStoreSchema),
    controller.update.bind(controller)
);

router.delete(
    "/:id",
    controller.delete.bind(controller)
);

export default router;