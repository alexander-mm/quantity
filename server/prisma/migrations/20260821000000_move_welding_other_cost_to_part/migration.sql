-- AlterTable
ALTER TABLE "public"."Part" ADD COLUMN     "otherCostAmount" DECIMAL(12,2),
ADD COLUMN     "otherCostDescription" TEXT,
ADD COLUMN     "weldingCost" DECIMAL(12,2);

-- Preservar datos ya cargados antes de borrar las columnas de PartRecipe
UPDATE "public"."Part" p
SET "weldingCost" = r."weldingCost",
    "otherCostDescription" = r."otherCostDescription",
    "otherCostAmount" = r."otherCostAmount"
FROM "public"."PartRecipe" r
WHERE r."partId" = p.id
  AND (r."weldingCost" IS NOT NULL OR r."otherCostDescription" IS NOT NULL OR r."otherCostAmount" IS NOT NULL);

-- AlterTable
ALTER TABLE "public"."PartRecipe" DROP COLUMN "otherCostAmount",
DROP COLUMN "otherCostDescription",
DROP COLUMN "weldingCost";
