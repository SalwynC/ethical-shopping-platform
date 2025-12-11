import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperService } from './scraper.service';
import { AIService } from './ai.service';

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
              priceAnalysis: { marketPosition: 'good', priceHistory: 'stable', confidence: 85 },
              insights: { keyStrengths: ['Good'], concerns: ['None'], bestTime: 'Now' },
              sustainability: { score: 75, factors: ['Good'], impact: 'Low' },
              alternatives: [],
            }),
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
