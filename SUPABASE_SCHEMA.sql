-- Ethical Shopping Platform - PostgreSQL Schema
-- Generated from Prisma schema for manual deployment to Supabase
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run

-- Create tables
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "platform" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "availability" TEXT NOT NULL DEFAULT 'unknown',
    "imageUrl" TEXT,
    "features" TEXT,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "dealScore" DOUBLE PRECISION NOT NULL,
    "ethicalScore" DOUBLE PRECISION NOT NULL,
    "trustScore" DOUBLE PRECISION NOT NULL,
    "decision" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "isGoodDeal" BOOLEAN NOT NULL,
    "savingsAmount" DOUBLE PRECISION,
    "priceRank" TEXT NOT NULL,
    "marketComparison" TEXT NOT NULL,
    "honestAssessment" TEXT NOT NULL,
    "pros" TEXT,
    "cons" TEXT,
    "warnings" TEXT,
    "brandRating" DOUBLE PRECISION NOT NULL,
    "environmentalImpact" TEXT NOT NULL,
    "ethicalSourcing" DOUBLE PRECISION NOT NULL,
    "analysisVersion" TEXT NOT NULL DEFAULT '1.0',
    "aiModel" TEXT,
    "processingTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Analysis_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Alternative" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "analysisId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "ethicalScore" DOUBLE PRECISION NOT NULL,
    "rationale" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "platform" TEXT NOT NULL,
    CONSTRAINT "Alternative_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "PriceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PriceHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "RuleEvaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "analysisId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "ruleName" TEXT NOT NULL,
    "contribution" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    CONSTRAINT "RuleEvaluation_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Product_platform_idx" ON "Product"("platform");
CREATE INDEX IF NOT EXISTS "Product_brand_idx" ON "Product"("brand");
CREATE INDEX IF NOT EXISTS "Product_createdAt_idx" ON "Product"("createdAt");

CREATE INDEX IF NOT EXISTS "Analysis_productId_idx" ON "Analysis"("productId");
CREATE INDEX IF NOT EXISTS "Analysis_createdAt_idx" ON "Analysis"("createdAt");

CREATE INDEX IF NOT EXISTS "Alternative_analysisId_idx" ON "Alternative"("analysisId");

CREATE INDEX IF NOT EXISTS "PriceHistory_productId_idx" ON "PriceHistory"("productId");
CREATE INDEX IF NOT EXISTS "PriceHistory_recordedAt_idx" ON "PriceHistory"("recordedAt");

CREATE INDEX IF NOT EXISTS "RuleEvaluation_analysisId_idx" ON "RuleEvaluation"("analysisId");
CREATE INDEX IF NOT EXISTS "RuleEvaluation_ruleId_idx" ON "RuleEvaluation"("ruleId");

-- Verify tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('Product', 'Analysis', 'Alternative', 'PriceHistory', 'RuleEvaluation')
ORDER BY table_name;
