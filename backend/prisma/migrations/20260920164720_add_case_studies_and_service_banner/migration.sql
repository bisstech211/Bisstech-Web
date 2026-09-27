-- AlterTable
ALTER TABLE "Service" ADD COLUMN "bannerImage" TEXT;
ALTER TABLE "Service" ADD COLUMN "bannerImageAlt" TEXT;
ALTER TABLE "Service" ADD COLUMN "bannerImageHeight" INTEGER;
ALTER TABLE "Service" ADD COLUMN "bannerImageWidth" INTEGER;

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "services" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "imageWidth" INTEGER,
    "imageHeight" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");
