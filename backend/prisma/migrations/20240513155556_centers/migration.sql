-- CreateTable
CREATE TABLE "centers" (
    "id" SERIAL NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "centers_pkey" PRIMARY KEY ("id")
);
