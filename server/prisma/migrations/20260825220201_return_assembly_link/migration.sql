-- AlterTable
ALTER TABLE "public"."Return" ADD COLUMN     "assemblyId" BIGINT;

-- AddForeignKey
ALTER TABLE "public"."Return" ADD CONSTRAINT "Return_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "public"."ProductAssembly"("id") ON DELETE SET NULL ON UPDATE CASCADE;
