import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperService } from './scraper.service';
import { AIService } from './ai.service';
import { PrismaService } from './database/prisma.service';
import { RealProductAnalyzerService } from './services/real-product-analyzer.service';
import { ReviewCheckerService } from './services/review-checker.service';

describe('AppController normalization and forceRefresh', () => {
  let appController: AppController;

  const mockScrape = jest.fn().mockResolvedValue({
    title: 'Scraped Product',
    price: 200,
    currency: 'INR',
    productId: 'scraped-1',
  });

  const mockFindOrCreate = jest.fn().mockResolvedValue({ id: 'prod-abc', title: 'Saved Product' });
  const mockAnalyze = jest.fn().mockResolvedValue({
    dealScore: 70,
    ethicalScore: 65,
    priceAnalysis: { marketPosition: 'average', priceHistory: 'stable', confidence: 70 },
    insights: { keyStrengths: [], concerns: [], bestTime: 'Now' },
    sustainability: { score: 60, factors: [], impact: 'Unknown' },
    alternatives: [],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ScraperService,
          useValue: { scrapeProduct: mockScrape },
        },
        { provide: AIService, useValue: { analyzeProduct: mockAnalyze } },
        {
          provide: PrismaService,
          useValue: {
            findOrCreateProduct: mockFindOrCreate,
            saveAnalysis: jest.fn().mockResolvedValue({ id: 'a1' }),
            savePriceHistory: jest.fn().mockResolvedValue(true),
          },
        },
        { provide: RealProductAnalyzerService, useValue: {} },
        { provide: ReviewCheckerService, useValue: { analyzeReviews: jest.fn().mockReturnValue({ score: 80, trustLevel: 'High', sentiment: 'Positive', quality: 80, flags: [], recommendation: 'ok' }), getReviewBadge: jest.fn().mockReturnValue('✅') } },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    jest.clearAllMocks();
  });

  it('passes normalized URL to scraper and DB for UTMs, uppercase host, trailing slash', async () => {
    const input = { url: 'HTTPS://EXAMPLE.COM/Product/?utm_source=google#frag' };

    await appController.analyze(input);

    // Expect scraper called with normalized url
    expect(mockScrape).toHaveBeenCalled();
    const scrapeCallArg = mockScrape.mock.calls[0][0];
    expect(scrapeCallArg).toBe('https://example.com/Product');

    // Expect DB findOrCreate called with normalized url (hostname lowercased, path preserved)
    expect(mockFindOrCreate).toHaveBeenCalled();
    const dbCallArg = mockFindOrCreate.mock.calls[0][0];
    expect(dbCallArg).toBe('https://example.com/Product');

    // Expect AI analyze called with normalized URL as second arg
    expect(mockAnalyze).toHaveBeenCalledWith(expect.any(Object), 'https://example.com/Product');
  });

  it('when productData present and forceRefresh=false skips scrape and uses normalized url', async () => {
    const input = { url: 'https://Example.com/ITEM/', productData: { title: 'x', price: 123 }, forceRefresh: false };

    await appController.analyze(input);

    expect(mockScrape).not.toHaveBeenCalled();
    const dbCallArg = mockFindOrCreate.mock.calls[0][0];
    expect(dbCallArg).toBe('https://example.com/ITEM');
  });

  it('when productData present and forceRefresh=true triggers a scrape', async () => {
    const input = { url: 'https://example.COM/THING?utm=1', productData: { title: 'x', price: 123 }, forceRefresh: true };

    await appController.analyze(input);

    expect(mockScrape).toHaveBeenCalled();
  });
});
