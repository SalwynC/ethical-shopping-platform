import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperService } from './scraper.service';
import { AIService } from './ai.service';
import { PrismaService } from './database/prisma.service';
import { RealProductAnalyzerService } from './services/real-product-analyzer.service';
import { ReviewCheckerService } from './services/review-checker.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ScraperService,
          useValue: {
            scrapeProduct: jest.fn().mockResolvedValue({
              title: 'Test Product',
              price: 100,
              currency: 'INR',
              productId: 'test-123',
            }),
          },
        },
        {
          provide: AIService,
          useValue: {
            analyzeProduct: jest.fn().mockResolvedValue({
              dealScore: 75,
              ethicalScore: 80,
              priceAnalysis: {
                marketPosition: 'good',
                priceHistory: 'stable',
                confidence: 85,
              },
              insights: {
                keyStrengths: ['Good'],
                concerns: ['None'],
                bestTime: 'Now',
              },
              sustainability: { score: 75, factors: ['Good'], impact: 'Low' },
              alternatives: [],
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            findOrCreateProduct: jest.fn().mockResolvedValue({ id: 'prod-1', title: 'Test Product' }),
            saveAnalysis: jest.fn().mockResolvedValue({ id: 'analysis-1' }),
            savePriceHistory: jest.fn().mockResolvedValue(true),
            getAnalysisHistory: jest.fn().mockResolvedValue([]),
            countAnalyses: jest.fn().mockResolvedValue(0),
            getAnalyticsData: jest.fn().mockResolvedValue({ totalAnalyses: 0, avgEthicalScore: 0, avgDealScore: 0, platformStats: {}, recentAnalyses: [] }),
            getFallbackRules: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: RealProductAnalyzerService,
          useValue: {
            getRealTimeStats: jest.fn().mockResolvedValue({ analyzing: 0, processed: 0, saved: 0 }),
            recordUserSavings: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ReviewCheckerService,
          useValue: {
            analyzeReviews: jest.fn().mockReturnValue({ score: 80, trustLevel: 'High', sentiment: 'Positive', quality: 80, flags: [], recommendation: 'ok' }),
            getReviewBadge: jest.fn().mockReturnValue('✅'),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('returns analysis payload for a url', async () => {
    const request = { url: 'https://example.com/product' };
    const analysis = await appController.analyze(request);
    expect(analysis.dealScore).toBeDefined();
    // Verify analysis completion
    expect(analysis.trustScore.dataReliability).toEqual(expect.any(Number));
  });

  it('reports service health', async () => {
    const health = await appController.getHealth();
    expect(health.status).toBe('healthy');
  });

  it('records consent', async () => {
    const request = { userId: 'test', consent: true };
    const response = await appController.recordConsent(request);
    expect(response.success).toBe(true);
  });
});
