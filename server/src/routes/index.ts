import { Router } from "express";
import { categoryRoutes } from "../modules/category/index.js";
import brandRoutes from "../modules/brand/brand.routes.js";
import unitOfMeasureRoutes from "../modules/unit-of-measure/unit-of-measure.routes.js";
import marginProfileRoutes from "../modules/margin-profile/margin-profile.routes.js";
import productRoutes from "../modules/product/product.routes.js";
import storeRoutes from "../modules/store/store.routes.js";
import roleRoutes from "../modules/role/role.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import movementTypeRoutes from "../modules/movement-type/movement-type.routes.js";
import clientRoutes from "../modules/client/client.routes.js";
import inventoryMovementRoutes from "../modules/inventory-movement/inventory-movement.routes.js";
import inventoryStockRoutes from "../modules/inventory-stock/inventory-stock.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import supplierRoutes from "../modules/supplier/supplier.routes.js";
import purchaseRoutes from "../modules/purchase/purchase.routes.js";
import saleRoutes from "../modules/sale/sale.routes.js";
import productPriceRoutes from "../modules/product-prices/product-price.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/categories", categoryRoutes);

router.use("/brands", brandRoutes);

router.use("/units-of-measure",unitOfMeasureRoutes);

router.use("/margin-profiles", marginProfileRoutes);

router.use("/products", productRoutes);

router.use("/stores", storeRoutes);

router.use("/roles", roleRoutes);

router.use("/users", userRoutes);

router.use("/suppliers", supplierRoutes);

router.use("/auth", authRoutes);

router.use("/movement-types", movementTypeRoutes);

router.use("/clients", clientRoutes);

router.use("/inventory-movements", inventoryMovementRoutes);

router.use("/inventory-stock", inventoryStockRoutes);

router.use("/dashboard", dashboardRoutes);

router.use("/purchases", purchaseRoutes);

router.use("/sales", saleRoutes);

router.use("/product-prices", productPriceRoutes);

export default router;