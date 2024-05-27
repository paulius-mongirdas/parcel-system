-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'IN_DELIVERY', 'DELIVERED', 'CANCELED', 'NOT_DELIVERED');

-- CreateTable
CREATE TABLE "transports" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "weight" INTEGER NOT NULL DEFAULT 0,
    "averageSpeed" INTEGER NOT NULL DEFAULT 0,
    "centerId" INTEGER,

    CONSTRAINT "transports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "centers" (
    "id" SERIAL NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),
    "price" DOUBLE PRECISION NOT NULL,
    "centerId" INTEGER NOT NULL,
    "transportId" INTEGER,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transports" ADD CONSTRAINT "transports_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transports"("id") ON DELETE SET NULL ON UPDATE CASCADE;
