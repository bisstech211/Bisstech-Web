-- CreateTable
CREATE TABLE "TokenBlacklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jti" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenBlacklist_jti_key" ON "TokenBlacklist"("jti");

-- CreateIndex
CREATE INDEX "TokenBlacklist_userId_idx" ON "TokenBlacklist"("userId");

-- CreateIndex
CREATE INDEX "TokenBlacklist_expiresAt_idx" ON "TokenBlacklist"("expiresAt");
