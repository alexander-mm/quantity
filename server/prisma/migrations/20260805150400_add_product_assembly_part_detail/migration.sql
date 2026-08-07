-- CreateTable
CREATE TABLE "public"."ProductAssemblyPartDetail" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "assemblyId" BIGINT NOT NULL,
    "partId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "ProductAssemblyPartDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductAssemblyPartDetail_uuid_key" ON "public"."ProductAssemblyPartDetail"("uuid");

-- CreateIndex
CREATE INDEX "ProductAssemblyPartDetail_assemblyId_idx" ON "public"."ProductAssemblyPartDetail"("assemblyId");

-- CreateIndex
CREATE INDEX "ProductAssemblyPartDetail_partId_idx" ON "public"."ProductAssemblyPartDetail"("partId");

-- AddForeignKey
ALTER TABLE "public"."ProductAssemblyPartDetail" ADD CONSTRAINT "ProductAssemblyPartDetail_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "public"."ProductAssembly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductAssemblyPartDetail" ADD CONSTRAINT "ProductAssemblyPartDetail_partId_fkey" FOREIGN KEY ("partId") REFERENCES "public"."Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

