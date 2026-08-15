-- AlterTable
ALTER TABLE "public"."PartMovement" ADD COLUMN     "isAdjustment" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."RawMaterialMovement" ADD COLUMN     "isAdjustment" BOOLEAN NOT NULL DEFAULT false;
