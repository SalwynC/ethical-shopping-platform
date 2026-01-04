import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaClient } from '@prisma/client';

describe('Analyze e2e (integration)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  }, 60000);

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('stores normalized URL in DB for a live URL', async () => {
    const raw = 'HTTPS://Example.com/product/?utm=1#x';
    const res = await request(app.getHttpServer()).post('/api/analyze').send({ url: raw }).expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.productInfo.title).toBeDefined();

    // Verify product saved in DB with normalized URL (hostname lowercased, no UTM, no fragment)
    const normalized = 'https://example.com/product';
    const product = await prisma.product.findFirst({ where: { url: normalized } });

    expect(product).toBeDefined();
    expect(product?.url).toBe(normalized);
  }, 60000);
});
