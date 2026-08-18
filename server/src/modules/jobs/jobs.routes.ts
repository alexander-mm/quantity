import { Router } from "express";

import { JobsController } from "./jobs.controller.js";

const router = Router();

const controller = new JobsController();

// Sin authenticate/authorize: pensadas para que las dispare un cron externo
// (Render free tier duerme el proceso, no se puede confiar en node-cron interno).
// Se protegen con ?secret=... (JOBS_TRIGGER_SECRET) en vez de un header, para que
// cualquier servicio de cron gratuito las pueda llamar sin configuración avanzada.
// .all() acepta GET o POST, según lo que soporte el cron externo elegido.
router.all("/low-stock", controller.lowStock.bind(controller));
router.all("/medium-stock", controller.mediumStock.bind(controller));
router.all("/weekly-report", controller.weeklyReport.bind(controller));
router.all("/account-receivable-alerts", controller.accountReceivableAlerts.bind(controller));

export default router;
