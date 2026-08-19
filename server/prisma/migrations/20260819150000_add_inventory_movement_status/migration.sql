-- AlterTable
ALTER TABLE "public"."InventoryMovement" ADD COLUMN "status" "public"."DocumentStatus" NOT NULL DEFAULT 'CONFIRMED';

-- CreateIndex
CREATE INDEX "InventoryMovement_status_idx" ON "public"."InventoryMovement"("status");
