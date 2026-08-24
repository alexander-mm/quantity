-- DropIndex
DROP INDEX "public"."Sale_number_key";

-- CreateIndex
CREATE UNIQUE INDEX "Sale_storeId_number_key" ON "public"."Sale"("storeId", "number");
