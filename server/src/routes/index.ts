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
import inventoryAdjustmentRoutes from "../modules/inventory-adjustment/inventory-adjustment.routes.js";
import stockTransferRoutes from "../modules/stock-transfer/stock-transfer.routes.js";
import partRoutes from "../modules/part/part.routes.js";
import partMovementRoutes from "../modules/part-movement/part-movement.routes.js";
import productComponentRoutes from "../modules/product-component/product-component.routes.js";
import productAssemblyRoutes from "../modules/product-assembly/product-assembly.routes.js";
import accountReceivableRoutes from "../modules/account-receivable/account-receivable.routes.js";
import rawMaterialRoutes from "../modules/raw-material/raw-material.routes.js";
import rawMaterialMovementRoutes from "../modules/raw-material-movement/raw-material-movement.routes.js";
import partRecipeRoutes from "../modules/part-recipe/part-recipe.routes.js";
import equipmentPartRoutes from "../modules/equipment-part/equipment-part.routes.js";
import partCuttingOrderRoutes from "../modules/part-cutting-order/part-cutting-order.routes.js";
import productPriceEntryRoutes from "../modules/product-price-entries/product-price-entry.routes.js";
import returnRoutes from "../modules/return/return.routes.js";
import partComponentRoutes from "../modules/part-component/part-component.routes.js";
import partComponentProductRoutes from "../modules/part-component-product/part-component-product.routes.js";
import partAssemblyRoutes from "../modules/part-assembly/part-assembly.routes.js";
import telegramRoutes from "../modules/telegram/telegram.routes.js";


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

router.use("/inventory-adjustments", inventoryAdjustmentRoutes);

router.use("/stock-transfers", stockTransferRoutes);

router.use("/parts", partRoutes);

router.use("/part-movements", partMovementRoutes);

router.use("/product-components", productComponentRoutes);

router.use("/product-assemblies", productAssemblyRoutes);

router.use("/part-components", partComponentRoutes);

router.use("/part-component-products", partComponentProductRoutes);

router.use("/part-assemblies", partAssemblyRoutes);

router.use("/accounts-receivable", accountReceivableRoutes);

router.use("/raw-materials", rawMaterialRoutes);

router.use("/raw-material-movements", rawMaterialMovementRoutes);

router.use("/part-recipes", partRecipeRoutes);

router.use("/equipment-parts", equipmentPartRoutes);

router.use("/part-cutting-orders", partCuttingOrderRoutes);

router.use("/product-price-entries", productPriceEntryRoutes);

router.use("/returns", returnRoutes);

router.use("/telegram", telegramRoutes);

export default router;