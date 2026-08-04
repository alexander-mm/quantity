-- CreateTable
CREATE TABLE "public"."ProductComponent" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "productId" BIGINT NOT NULL,
    "componentProductId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductAssembly" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "productId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "userId" BIGINT NOT NULL,
    "assemblyDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductAssembly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductAssemblyDetail" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "assemblyId" BIGINT NOT NULL,
    "componentProductId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "ProductAssemblyDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductComponent_uuid_key" ON "public"."ProductComponent"("uuid");

-- CreateIndex
CREATE INDEX "ProductComponent_productId_idx" ON "public"."ProductComponent"("productId");

-- CreateIndex
CREATE INDEX "ProductComponent_componentProductId_idx" ON "public"."ProductComponent"("componentProductId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductComponent_productId_componentProductId_key" ON "public"."ProductComponent"("productId", "componentProductId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAssembly_uuid_key" ON "public"."ProductAssembly"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAssembly_number_key" ON "public"."ProductAssembly"("number");

-- CreateIndex
CREATE INDEX "ProductAssembly_productId_idx" ON "public"."ProductAssembly"("productId");

-- CreateIndex
CREATE INDEX "ProductAssembly_userId_idx" ON "public"."ProductAssembly"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAssemblyDetail_uuid_key" ON "public"."ProductAssemblyDetail"("uuid");

-- CreateIndex
CREATE INDEX "ProductAssemblyDetail_assemblyId_idx" ON "public"."ProductAssemblyDetail"("assemblyId");

-- CreateIndex
CREATE INDEX "ProductAssemblyDetail_componentProductId_idx" ON "public"."ProductAssemblyDetail"("componentProductId");

-- AddForeignKey
ALTER TABLE "public"."ProductComponent" ADD CONSTRAINT "ProductComponent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductComponent" ADD CONSTRAINT "ProductComponent_componentProductId_fkey" FOREIGN KEY ("componentProductId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductAssembly" ADD CONSTRAINT "ProductAssembly_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductAssembly" ADD CONSTRAINT "ProductAssembly_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductAssemblyDetail" ADD CONSTRAINT "ProductAssemblyDetail_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "public"."ProductAssembly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductAssemblyDetail" ADD CONSTRAINT "ProductAssemblyDetail_componentProductId_fkey" FOREIGN KEY ("componentProductId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
