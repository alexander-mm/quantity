-- AlterTable
ALTER TABLE "public"."PartRecipe" ADD COLUMN     "bendCount" DECIMAL(10,2),
ADD COLUMN     "curveCount" DECIMAL(10,2),
ADD COLUMN     "laserMeters" DECIMAL(10,2),
ADD COLUMN     "otherCostAmount" DECIMAL(12,2),
ADD COLUMN     "otherCostDescription" TEXT,
ADD COLUMN     "usesMechanicalCut" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "weldingCost" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "public"."RawMaterial" ADD COLUMN     "bendCostPerBend" DECIMAL(12,2),
ADD COLUMN     "cost" DECIMAL(12,2),
ADD COLUMN     "curveCostPerCurve" DECIMAL(12,2),
ADD COLUMN     "laserCostPerMeter" DECIMAL(12,2),
ADD COLUMN     "mechanicalCutCost" DECIMAL(12,2),
ADD COLUMN     "wastePercentage" DECIMAL(5,2);
