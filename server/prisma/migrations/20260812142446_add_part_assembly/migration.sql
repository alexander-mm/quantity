-- CreateTable
CREATE TABLE "public"."PartComponent" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "partId" BIGINT NOT NULL,
    "componentPartId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PartComponentProduct" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "partId" BIGINT NOT NULL,
    "componentProductId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartComponentProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PartAssembly" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "partId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "userId" BIGINT NOT NULL,
    "status" "public"."DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "assemblyDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartAssembly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PartAssemblyDetail" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "assemblyId" BIGINT NOT NULL,
    "componentPartId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "PartAssemblyDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PartAssemblyProductDetail" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "assemblyId" BIGINT NOT NULL,
    "componentProductId" BIGINT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "PartAssemblyProductDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartComponent_uuid_key" ON "public"."PartComponent"("uuid");

-- CreateIndex
CREATE INDEX "PartComponent_partId_idx" ON "public"."PartComponent"("partId");

-- CreateIndex
CREATE INDEX "PartComponent_componentPartId_idx" ON "public"."PartComponent"("componentPartId");

-- CreateIndex
CREATE UNIQUE INDEX "PartComponent_partId_componentPartId_key" ON "public"."PartComponent"("partId", "componentPartId");

-- CreateIndex
CREATE UNIQUE INDEX "PartComponentProduct_uuid_key" ON "public"."PartComponentProduct"("uuid");

-- CreateIndex
CREATE INDEX "PartComponentProduct_partId_idx" ON "public"."PartComponentProduct"("partId");

-- CreateIndex
CREATE INDEX "PartComponentProduct_componentProductId_idx" ON "public"."PartComponentProduct"("componentProductId");

-- CreateIndex
CREATE UNIQUE INDEX "PartComponentProduct_partId_componentProductId_key" ON "public"."PartComponentProduct"("partId", "componentProductId");

-- CreateIndex
CREATE UNIQUE INDEX "PartAssembly_uuid_key" ON "public"."PartAssembly"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PartAssembly_number_key" ON "public"."PartAssembly"("number");

-- CreateIndex
CREATE INDEX "PartAssembly_partId_idx" ON "public"."PartAssembly"("partId");

-- CreateIndex
CREATE INDEX "PartAssembly_userId_idx" ON "public"."PartAssembly"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PartAssemblyDetail_uuid_key" ON "public"."PartAssemblyDetail"("uuid");

-- CreateIndex
CREATE INDEX "PartAssemblyDetail_assemblyId_idx" ON "public"."PartAssemblyDetail"("assemblyId");

-- CreateIndex
CREATE INDEX "PartAssemblyDetail_componentPartId_idx" ON "public"."PartAssemblyDetail"("componentPartId");

-- CreateIndex
CREATE UNIQUE INDEX "PartAssemblyProductDetail_uuid_key" ON "public"."PartAssemblyProductDetail"("uuid");

-- CreateIndex
CREATE INDEX "PartAssemblyProductDetail_assemblyId_idx" ON "public"."PartAssemblyProductDetail"("assemblyId");

-- CreateIndex
CREATE INDEX "PartAssemblyProductDetail_componentProductId_idx" ON "public"."PartAssemblyProductDetail"("componentProductId");

-- AddForeignKey
ALTER TABLE "public"."PartComponent" ADD CONSTRAINT "PartComponent_partId_fkey" FOREIGN KEY ("partId") REFERENCES "public"."Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartComponent" ADD CONSTRAINT "PartComponent_componentPartId_fkey" FOREIGN KEY ("componentPartId") REFERENCES "public"."Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartComponentProduct" ADD CONSTRAINT "PartComponentProduct_partId_fkey" FOREIGN KEY ("partId") REFERENCES "public"."Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartComponentProduct" ADD CONSTRAINT "PartComponentProduct_componentProductId_fkey" FOREIGN KEY ("componentProductId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartAssembly" ADD CONSTRAINT "PartAssembly_partId_fkey" FOREIGN KEY ("partId") REFERENCES "public"."Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartAssembly" ADD CONSTRAINT "PartAssembly_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartAssemblyDetail" ADD CONSTRAINT "PartAssemblyDetail_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "public"."PartAssembly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartAssemblyDetail" ADD CONSTRAINT "PartAssemblyDetail_componentPartId_fkey" FOREIGN KEY ("componentPartId") REFERENCES "public"."Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartAssemblyProductDetail" ADD CONSTRAINT "PartAssemblyProductDetail_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "public"."PartAssembly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartAssemblyProductDetail" ADD CONSTRAINT "PartAssemblyProductDetail_componentProductId_fkey" FOREIGN KEY ("componentProductId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
