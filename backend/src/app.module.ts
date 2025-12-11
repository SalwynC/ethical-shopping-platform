import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperService } from './scraper.service';
import { AIService } from './ai.service';
import { RealDataService } from './real-data.service';
import { PrismaService } from './database/prisma.service';
import { InternalProductDbService } from './services/internal-product-db.service';
import { SustainabilityAnalyzerService } from './services/sustainability-analyzer.service';
import { AlternativesEngineService } from './services/alternatives-engine.service';
import { PriceComparisonService } from './services/price-comparison.service';
import { AIScraperService } from './services/ai-scraper.service';
import { HtmlScraperService } from './services/html-scraper.service';
import { ReviewCheckerService } from './services/review-checker.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    ScraperService,
    AIService,
    RealDataService,
    PrismaService,
    // ============================================
    // ACTIVE SERVICES - 3-TIER SCRAPING SYSTEM
    // ============================================
    HtmlScraperService,      // Priority 1: Direct HTML scraping with Cheerio
    AIScraperService,        // Priority 2: AI extraction (Gemini)
    // Internal Database fallback for common products
    InternalProductDbService,
    // Analytics & Recommendations
    SustainabilityAnalyzerService,
    AlternativesEngineService,
    PriceComparisonService,
    ReviewCheckerService,
  ],
})
export class AppModule {}
