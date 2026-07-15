import { Router } from "express";
import authRoutes from "./auth.routes.js";
import { categoryRoutes } from "../modules/category/index.js";
import brandRoutes from "../modules/brand/brand.routes.js";
import unitOfMeasureRoutes from "../modules/unit-of-measure/unit-of-measure.routes.js";
import marginProfileRoutes from "../modules/margin-profile/margin-profile.routes.js";
import productRoutes from "../modules/product/product.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/categories", categoryRoutes);

router.use("/brands", brandRoutes);

router.use("/units-of-measure",unitOfMeasureRoutes);

router.use("/margin-profiles", marginProfileRoutes);

router.use("/products", productRoutes);
export default router;