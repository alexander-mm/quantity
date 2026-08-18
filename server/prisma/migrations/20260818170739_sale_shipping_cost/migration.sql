-- AlterTable
ALTER TABLE "public"."Sale" ADD COLUMN     "hasShipping" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "public"."Sale" ADD COLUMN     "shippingCost" DECIMAL(12,2) NOT NULL DEFAULT 0;
