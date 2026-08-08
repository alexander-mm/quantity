-- AlterTable
ALTER TABLE "public"."Part" ADD COLUMN     "minimumStock" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."RawMaterial" ADD COLUMN     "minimumStock" DECIMAL(12,2) NOT NULL DEFAULT 0;
