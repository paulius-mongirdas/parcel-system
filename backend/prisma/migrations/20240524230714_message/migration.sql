-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);
