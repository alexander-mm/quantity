import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";
import { AttendanceController } from "./attendance.controller.js";
import { clockAttendanceSchema, setAttendancePinSchema } from "./attendance.validator.js";

const router = Router();

const controller = new AttendanceController();

// Sin autenticación a propósito: el reloj checador vive en el equipo de la tienda y las
// personas que fichan no tienen (ni necesitan) una sesión completa en el sistema. La
// restricción real es la IP de origen, validada del lado del servidor en el service.
router.get(
    "/kiosk-context",
    controller.kioskContext.bind(controller)
);

router.post(
    "/clock",
    validate(clockAttendanceSchema),
    controller.clock.bind(controller)
);

router.get(
    "/",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.findAll.bind(controller)
);

router.put(
    "/pin/:userId",
    authenticate,
    authorize(ROLES.ADMIN),
    validate(setAttendancePinSchema),
    controller.setPin.bind(controller)
);

export default router;
