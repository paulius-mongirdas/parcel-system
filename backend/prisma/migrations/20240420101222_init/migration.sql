-- CreateTable
CREATE TABLE "transports" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "averageSpeed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "transports_pkey" PRIMARY KEY ("id")
);
