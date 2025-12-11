import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import type { AppController } from './../src/app.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let requestTarget: Parameters<typeof request>[0];
  type HealthResponse = ReturnType<AppController['getHealth']>;
  type AnalyzeResponse = ReturnType<AppController['analyze']>;

  function assertIsRequestTarget(
    candidate: unknown,
  ): asserts candidate is Parameters<typeof request>[0] {
    if (
      candidate === null ||
      (typeof candidate !== 'function' && typeof candidate !== 'object')
    ) {
      throw new Error('Invalid HTTP server returned by Nest application');
    }
  }

  function isHealthResponse(payload: unknown): payload is HealthResponse {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      'status' in payload &&
      'services' in payload
    );
  }

  function isAnalyzeResponse(payload: unknown): payload is AnalyzeResponse {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      'decision' in payload &&
      'ethicalScore' in payload &&
      'meta' in payload
    );
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const server: unknown = app.getHttpServer();
    assertIsRequestTarget(server);
    requestTarget = server;
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/health returns service status', async () => {
    const response = await request(requestTarget)
      .get('/api/health')
      .expect(200);

    const body: unknown = response.body;
    expect(isHealthResponse(body)).toBe(true);
    if (!isHealthResponse(body)) {
      throw new Error('Health response did not match expected schema');
    }

    expect(body.status).toBe('ok');
    expect(Array.isArray(body.services)).toBe(true);
  });

  it('POST /api/analyze returns analysis payload', async () => {
    const response = await request(requestTarget)
      .post('/api/analyze')
      .send({ url: 'https://example.com/product' })
      .expect(201);

    const body: unknown = response.body;
    expect(isAnalyzeResponse(body)).toBe(true);
    if (!isAnalyzeResponse(body)) {
      throw new Error('Analyze response did not match expected schema');
    }

    expect(typeof body.decision).toBe('string');
    expect(typeof body.ethicalScore).toBe('number');
    expect(typeof body.meta.analyzedAt).toBe('string');
  });
});
