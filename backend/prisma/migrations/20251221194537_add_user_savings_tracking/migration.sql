-- CreateTable
CREATE TABLE "UserSavings" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION NOT NULL,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "productTitle" TEXT NOT NULL,
    "platform" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "sessionId" TEXT,

    CONSTRAINT "UserSavings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSavings_purchasedAt_idx" ON "UserSavings"("purchasedAt");

-- CreateIndex
CREATE INDEX "UserSavings_recordedAt_idx" ON "UserSavings"("recordedAt");

-- CreateIndex
CREATE INDEX "UserSavings_analysisId_idx" ON "UserSavings"("analysisId");

-- AddForeignKey
ALTER TABLE "UserSavings" ADD CONSTRAINT "UserSavings_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
