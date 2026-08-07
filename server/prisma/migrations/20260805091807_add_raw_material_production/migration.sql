-- CreateEnum
CREATE TYPE "public"."RawMaterialShape" AS ENUM ('SHEET', 'TUBE');

-- CreateEnum
CREATE TYPE "public"."TubeProfile" AS ENUM ('ROUND', 'SQUARE', 'RECTANGULAR');

-- CreateEnum
CREATE TYPE "public"."RawMaterialMovementType" AS ENUM ('IN', 'OUT');

-- AlterTable
ALTER TABLE "public"."PartMovement" ADD COLUMN     "cuttingOrderId" BIGINT;

-- CreateTable
CREATE TABLE "public"."RawMaterial" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shape" "public"."RawMaterialShape" NOT NULL,
    "material" TEXT NOT NULL,
    "thickness" DECIMAL(8,3) NOT NULL,
    "width" DECIMAL(10,2),
    "height" DECIMAL(10,2),
    "length" DECIMAL(10,2),
    "profile" "public"."TubeProfile",
    "costPrice" DECIMAL(12,2) NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "RawMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RawMaterialMovement" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "type" "public"."RawMaterialMovementType" NOT NULL,
    "userId" BIGINT NOT NULL,
    "cuttingOrderId" BIGINT,
    "movementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawMaterialMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RawMaterialMovementDetail" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "movementId" BIGINT NOT NULL,
    "rawMaterialId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "RawMaterialMovementDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PartRecipe" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "partId" BIGINT NOT NULL,
    "rawMaterialId" BIGINT NOT NULL,
    "pieceWidth" DECIMAL(10,2),
    "pieceHeight" DECIMAL(10,2),
    "pieceLength" DECIMAL(10,2),
    "piecesPerUnit" DECIMAL(12,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "PartRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EquipmentPart" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "productId" BIGINT NOT NULL,
    "partId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PartCuttingOrder" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "partId" BIGINT NOT NULL,
    "rawMaterialId" BIGINT NOT NULL,
    "rawMaterialQtyUsed" DECIMAL(12,2) NOT NULL,
    "expectedPieces" DECIMAL(12,2) NOT NULL,
    "goodPieces" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "defectivePieces" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "public"."DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "userId" BIGINT NOT NULL,
    "cuttingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" BIGINT,
    "updatedBy" BIGINT,

    CONSTRAINT "PartCuttingOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RawMaterial_uuid_key" ON "public"."RawMaterial"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "RawMaterial_code_key" ON "public"."RawMaterial"("code");

-- CreateIndex
CREATE INDEX "RawMaterial_isActive_idx" ON "public"."RawMaterial"("isActive");

-- CreateIndex
CREATE INDEX "RawMaterial_shape_idx" ON "public"."RawMaterial"("shape");

-- CreateIndex
CREATE UNIQUE INDEX "RawMaterialMovement_uuid_key" ON "public"."RawMaterialMovement"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "RawMaterialMovement_number_key" ON "public"."RawMaterialMovement"("number");

-- CreateIndex
CREATE UNIQUE INDEX "RawMaterialMovement_cuttingOrderId_key" ON "public"."RawMaterialMovement"("cuttingOrderId");

-- CreateIndex
CREATE INDEX "RawMaterialMovement_type_idx" ON "public"."RawMaterialMovement"("type");

-- CreateIndex
CREATE INDEX "RawMaterialMovement_userId_idx" ON "public"."RawMaterialMovement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RawMaterialMovementDetail_uuid_key" ON "public"."RawMaterialMovementDetail"("uuid");

-- CreateIndex
CREATE INDEX "RawMaterialMovementDetail_movementId_idx" ON "public"."RawMaterialMovementDetail"("movementId");

-- CreateIndex
CREATE INDEX "RawMaterialMovementDetail_rawMaterialId_idx" ON "public"."RawMaterialMovementDetail"("rawMaterialId");

-- CreateIndex
CREATE UNIQUE INDEX "PartRecipe_uuid_key" ON "public"."PartRecipe"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PartRecipe_partId_key" ON "public"."PartRecipe"("partId");

-- CreateIndex
CREATE INDEX "PartRecipe_rawMaterialId_idx" ON "public"."PartRecipe"("rawMaterialId");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentPart_uuid_key" ON "public"."EquipmentPart"("uuid");

-- CreateIndex
CREATE INDEX "EquipmentPart_productId_idx" ON "public"."EquipmentPart"("productId");

-- CreateIndex
CREATE INDEX "EquipmentPart_partId_idx" ON "public"."EquipmentPart"("partId");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentPart_productId_partId_key" ON "public"."EquipmentPart"("productId", "partId");

-- CreateIndex
CREATE UNIQUE INDEX "PartCuttingOrder_uuid_key" ON "public"."PartCuttingOrder"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PartCuttingOrder_number_key" ON "public"."PartCuttingOrder"("number");

-- CreateIndex
CREATE INDEX "PartCuttingOrder_partId_idx" ON "public"."PartCuttingOrder"("partId");

-- CreateIndex
CREATE INDEX "PartCuttingOrder_rawMaterialId_idx" ON "public"."PartCuttingOrder"("rawMaterialId");

-- CreateIndex
CREATE INDEX "PartCuttingOrder_userId_idx" ON "public"."PartCuttingOrder"("userId");

-- CreateIndex
CREATE INDEX "PartCuttingOrder_status_idx" ON "public"."PartCuttingOrder"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PartMovement_cuttingOrderId_key" ON "public"."PartMovement"("cuttingOrderId");

-- AddForeignKey
ALTER TABLE "public"."PartMovement" ADD CONSTRAINT "PartMovement_cuttingOrderId_fkey" FOREIGN KEY ("cuttingOrderId") REFERENCES "public"."PartCuttingOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RawMaterialMovement" ADD CONSTRAINT "RawMaterialMovement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RawMaterialMovement" ADD CONSTRAINT "RawMaterialMovement_cuttingOrderId_fkey" FOREIGN KEY ("cuttingOrderId") REFERENCES "public"."PartCuttingOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RawMaterialMovementDetail" ADD CONSTRAINT "RawMaterialMovementDetail_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "public"."RawMaterialMovement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RawMaterialMovementDetail" ADD CONSTRAINT "RawMaterialMovementDetail_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "public"."RawMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartRecipe" ADD CONSTRAINT "PartRecipe_partId_fkey" FOREIGN KEY ("partId") REFERENCES "public"."Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartRecipe" ADD CONSTRAINT "PartRecipe_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "public"."RawMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EquipmentPart" ADD CONSTRAINT "EquipmentPart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EquipmentPart" ADD CONSTRAINT "EquipmentPart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "public"."Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartCuttingOrder" ADD CONSTRAINT "PartCuttingOrder_partId_fkey" FOREIGN KEY ("partId") REFERENCES "public"."Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartCuttingOrder" ADD CONSTRAINT "PartCuttingOrder_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "public"."RawMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartCuttingOrder" ADD CONSTRAINT "PartCuttingOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

