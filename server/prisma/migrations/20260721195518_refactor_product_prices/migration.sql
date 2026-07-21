-- CreateEnum
CREATE TYPE "public"."StoreType" AS ENUM ('MAIN_WAREHOUSE', 'STORE');

-- CreateEnum
CREATE TYPE "public"."StockOperation" AS ENUM ('IN', 'OUT', 'NONE');

-- CreateEnum
CREATE TYPE "public"."SyncStatus" AS ENUM ('PENDING', 'SYNCED', 'ERROR');

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Store" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."StoreType" NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "manager" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "roleId" BIGINT NOT NULL,
    "storeId" BIGINT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentCategoryId" BIGINT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Brand" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UnitOfMeasure" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "UnitOfMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "internalCode" TEXT NOT NULL,
    "barcode" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brandId" BIGINT NOT NULL,
    "categoryId" BIGINT NOT NULL,
    "unitOfMeasureId" BIGINT NOT NULL,
    "costPrice" DECIMAL(12,2) NOT NULL,
    "minimumStock" DECIMAL(12,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarginProfile" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "MarginProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductPrice" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "productId" BIGINT NOT NULL,
    "marginProfileId" BIGINT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "ProductPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "companyName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MovementType" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "affectsStock" BOOLEAN NOT NULL DEFAULT true,
    "stockOperation" "public"."StockOperation" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "MovementType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InventoryMovement" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "movementTypeId" BIGINT NOT NULL,
    "productId" BIGINT NOT NULL,
    "storeId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "clientId" BIGINT,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unitCost" DECIMAL(12,2) NOT NULL,
    "observations" TEXT,
    "movementDate" TIMESTAMP(3) NOT NULL,
    "syncStatus" "public"."SyncStatus" NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InventoryStock" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "productId" BIGINT NOT NULL,
    "storeId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lastMovementId" BIGINT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "InventoryStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Settings" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "syncInterval" INTEGER NOT NULL DEFAULT 5,
    "lowStockAlerts" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_uuid_key" ON "public"."Role"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Store_uuid_key" ON "public"."Store"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Store_code_key" ON "public"."Store"("code");

-- CreateIndex
CREATE INDEX "Store_type_idx" ON "public"."Store"("type");

-- CreateIndex
CREATE INDEX "Store_isActive_idx" ON "public"."Store"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "public"."User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "public"."User"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Category_uuid_key" ON "public"."Category"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE INDEX "Category_parentCategoryId_idx" ON "public"."Category"("parentCategoryId");

-- CreateIndex
CREATE INDEX "Category_isActive_idx" ON "public"."Category"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_uuid_key" ON "public"."Brand"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "public"."Brand"("name");

-- CreateIndex
CREATE INDEX "Brand_isActive_idx" ON "public"."Brand"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UnitOfMeasure_uuid_key" ON "public"."UnitOfMeasure"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UnitOfMeasure_code_key" ON "public"."UnitOfMeasure"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UnitOfMeasure_name_key" ON "public"."UnitOfMeasure"("name");

-- CreateIndex
CREATE INDEX "UnitOfMeasure_isActive_idx" ON "public"."UnitOfMeasure"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Product_uuid_key" ON "public"."Product"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Product_internalCode_key" ON "public"."Product"("internalCode");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "public"."Product"("barcode");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "public"."Product"("name");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "public"."Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "public"."Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_unitOfMeasureId_idx" ON "public"."Product"("unitOfMeasureId");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "public"."Product"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "MarginProfile_uuid_key" ON "public"."MarginProfile"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "MarginProfile_name_key" ON "public"."MarginProfile"("name");

-- CreateIndex
CREATE INDEX "MarginProfile_displayOrder_idx" ON "public"."MarginProfile"("displayOrder");

-- CreateIndex
CREATE INDEX "MarginProfile_isActive_idx" ON "public"."MarginProfile"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPrice_uuid_key" ON "public"."ProductPrice"("uuid");

-- CreateIndex
CREATE INDEX "ProductPrice_marginProfileId_idx" ON "public"."ProductPrice"("marginProfileId");

-- CreateIndex
CREATE INDEX "ProductPrice_isActive_idx" ON "public"."ProductPrice"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPrice_productId_marginProfileId_key" ON "public"."ProductPrice"("productId", "marginProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_uuid_key" ON "public"."Client"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Client_document_key" ON "public"."Client"("document");

-- CreateIndex
CREATE INDEX "Client_firstName_idx" ON "public"."Client"("firstName");

-- CreateIndex
CREATE INDEX "Client_lastName_idx" ON "public"."Client"("lastName");

-- CreateIndex
CREATE INDEX "Client_companyName_idx" ON "public"."Client"("companyName");

-- CreateIndex
CREATE INDEX "Client_isActive_idx" ON "public"."Client"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "MovementType_uuid_key" ON "public"."MovementType"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "MovementType_code_key" ON "public"."MovementType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MovementType_name_key" ON "public"."MovementType"("name");

-- CreateIndex
CREATE INDEX "MovementType_isActive_idx" ON "public"."MovementType"("isActive");

-- CreateIndex
CREATE INDEX "MovementType_stockOperation_idx" ON "public"."MovementType"("stockOperation");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryMovement_uuid_key" ON "public"."InventoryMovement"("uuid");

-- CreateIndex
CREATE INDEX "InventoryMovement_movementDate_idx" ON "public"."InventoryMovement"("movementDate");

-- CreateIndex
CREATE INDEX "InventoryMovement_productId_idx" ON "public"."InventoryMovement"("productId");

-- CreateIndex
CREATE INDEX "InventoryMovement_storeId_idx" ON "public"."InventoryMovement"("storeId");

-- CreateIndex
CREATE INDEX "InventoryMovement_userId_idx" ON "public"."InventoryMovement"("userId");

-- CreateIndex
CREATE INDEX "InventoryMovement_clientId_idx" ON "public"."InventoryMovement"("clientId");

-- CreateIndex
CREATE INDEX "InventoryMovement_movementTypeId_idx" ON "public"."InventoryMovement"("movementTypeId");

-- CreateIndex
CREATE INDEX "InventoryMovement_syncStatus_idx" ON "public"."InventoryMovement"("syncStatus");

-- CreateIndex
CREATE INDEX "InventoryMovement_productId_movementDate_idx" ON "public"."InventoryMovement"("productId", "movementDate");

-- CreateIndex
CREATE INDEX "InventoryMovement_storeId_movementDate_idx" ON "public"."InventoryMovement"("storeId", "movementDate");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryStock_uuid_key" ON "public"."InventoryStock"("uuid");

-- CreateIndex
CREATE INDEX "InventoryStock_storeId_idx" ON "public"."InventoryStock"("storeId");

-- CreateIndex
CREATE INDEX "InventoryStock_quantity_idx" ON "public"."InventoryStock"("quantity");

-- CreateIndex
CREATE INDEX "InventoryStock_isActive_idx" ON "public"."InventoryStock"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryStock_productId_storeId_key" ON "public"."InventoryStock"("productId", "storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_uuid_key" ON "public"."Settings"("uuid");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_unitOfMeasureId_fkey" FOREIGN KEY ("unitOfMeasureId") REFERENCES "public"."UnitOfMeasure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductPrice" ADD CONSTRAINT "ProductPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductPrice" ADD CONSTRAINT "ProductPrice_marginProfileId_fkey" FOREIGN KEY ("marginProfileId") REFERENCES "public"."MarginProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryMovement" ADD CONSTRAINT "InventoryMovement_movementTypeId_fkey" FOREIGN KEY ("movementTypeId") REFERENCES "public"."MovementType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryMovement" ADD CONSTRAINT "InventoryMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryMovement" ADD CONSTRAINT "InventoryMovement_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryMovement" ADD CONSTRAINT "InventoryMovement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryMovement" ADD CONSTRAINT "InventoryMovement_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryStock" ADD CONSTRAINT "InventoryStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryStock" ADD CONSTRAINT "InventoryStock_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
