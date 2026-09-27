-- AlterTable
ALTER TABLE "Service" ADD COLUMN "benefits" TEXT;
ALTER TABLE "Service" ADD COLUMN "deliverables" TEXT;
ALTER TABLE "Service" ADD COLUMN "extra" TEXT;

-- CreateTable
CREATE TABLE "ServiceProcess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ServiceProcess_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
