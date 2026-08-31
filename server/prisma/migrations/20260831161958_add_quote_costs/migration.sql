-- AlterTable
ALTER TABLE "public"."Quote" ADD COLUMN     "additionalCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "hasAdditionalCost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasShipping" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shippingCost" DECIMAL(12,2) NOT NULL DEFAULT 0;
