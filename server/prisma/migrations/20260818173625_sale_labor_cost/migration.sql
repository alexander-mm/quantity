-- AlterTable
ALTER TABLE "public"."Sale" ADD COLUMN     "hasLabor" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "public"."Sale" ADD COLUMN     "laborCost" DECIMAL(12,2) NOT NULL DEFAULT 0;
