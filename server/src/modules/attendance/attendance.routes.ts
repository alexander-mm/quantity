import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { ROLES } from "../../shared/constants/roles.js";
import { AttendanceController } from "./attendance.controller.js";
import {
    clockAttendanceSchema,
    enrollDeviceSchema,
    enrollOptionsSchema,
    setAttendancePinSchema
} from "./attendance.validator.js";

const router = Router();

const controller = new AttendanceController();

// Sin autenticación a propósito: el reloj checador vive en el equipo de la tienda y las
// personas que fichan no tienen (ni necesitan) una sesión completa en el sistema. La
// restricción real es el equipo autorizado (o la IP de origen), validada en el service.
router.get(
    "/kiosk-context",
    controller.kioskContext.bind(controller)
);

router.post(
    "/clock",
    validate(clockAttendanceSchema),
    controller.clock.bind(controller)
);

// Sin sesión a propósito: el admin se conecta al equipo de la tienda (ej. por AnyDesk) y
// escribe sus credenciales en el propio reloj checador. Se validan en cada llamada y no se
// crea ninguna sesión, así no queda una sesión de administrador abierta en ese equipo.
router.post(
    "/devices/enroll-options",
    validate(enrollOptionsSchema),
    controller.enrollOptions.bind(controller)
);

router.post(
    "/devices/enroll",
    validate(enrollDeviceSchema),
    controller.enrollDevice.bind(controller)
);

router.get(
    "/devices",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.findDevices.bind(controller)
);

router.delete(
    "/devices/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    controller.revokeDevice.bind(controller)
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
