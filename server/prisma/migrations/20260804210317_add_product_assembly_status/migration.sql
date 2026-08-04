-- AlterTable
ALTER TABLE "public"."ProductAssembly" ADD COLUMN     "status" "public"."DocumentStatus" NOT NULL DEFAULT 'DRAFT';
