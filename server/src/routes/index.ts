import { Router } from "express";

import authRoutes from "./auth.routes.js";

import { categoryRoutes } from "../modules/category/index.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/categories", categoryRoutes);

export default router;