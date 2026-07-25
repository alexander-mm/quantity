/*
  Warnings:

  - You are about to drop the column `isActive` on the `InventoryStock` table. All the data in the column will be lost.
  - You are about to drop the column `lastMovementId` on the `InventoryStock` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."InventoryStock_isActive_idx";

-- DropIndex
DROP INDEX "public"."InventoryStock_quantity_idx";

-- AlterTable
ALTER TABLE "public"."InventoryStock" DROP COLUMN "isActive",
DROP COLUMN "lastMovementId",
ALTER COLUMN "quantity" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "InventoryStock_productId_idx" ON "public"."InventoryStock"("productId");
